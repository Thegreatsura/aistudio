/**
 * xAI (Grok) API Client
 *
 * Provides image editing and video generation capabilities via xAI's API.
 * Note: xAI does NOT support mask-based inpainting - only prompt-based editing.
 */

const XAI_API_URL = "https://api.x.ai/v1";

// ============================================================================
// Types
// ============================================================================

export interface XAIImageEditInput {
  image: string; // Base64 encoded image or URL
  prompt: string;
  model?: string;
  n?: number; // Number of images to generate (default: 1)
}

export interface XAIImageEditOutput {
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

export interface XAIVideoInput {
  prompt: string;
  model?: string;
  image_url?: string; // Source image for image-to-video
  duration?: number; // 1-15 seconds
  aspect_ratio?: "16:9" | "4:3" | "1:1" | "9:16" | "3:4" | "3:2" | "2:3";
}

export interface XAIVideoSubmitResponse {
  request_id: string;
}

export interface XAIVideoStatusResponse {
  status: "pending" | "processing" | "completed" | "failed";
  video_url?: string;
  error?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getApiKey(): string {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY environment variable is not set");
  }
  return apiKey;
}

async function xaiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = getApiKey();

  const response = await fetch(`${XAI_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`xAI API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// Image Editing
// ============================================================================

/**
 * Edit an image using xAI's image editing API.
 * Note: This is prompt-only editing - no mask support.
 * The xAI API requires multipart form data with the image as a file upload.
 */
export async function editImage(
  input: XAIImageEditInput
): Promise<{ url: string }> {
  const apiKey = getApiKey();

  // Create form data for the request
  const formData = new FormData();

  // If the image is a URL, fetch it first and add as a file
  if (input.image.startsWith("http://") || input.image.startsWith("https://")) {
    const imageResponse = await fetch(input.image);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }
    const imageBlob = await imageResponse.blob();
    formData.append("image", imageBlob, "image.png");
  } else if (input.image.startsWith("data:")) {
    // Handle data URL (base64)
    const base64Data = input.image.split(",")[1];
    const mimeType = input.image.split(";")[0].split(":")[1];
    const binaryData = Buffer.from(base64Data, "base64");
    const blob = new Blob([binaryData], { type: mimeType });
    formData.append("image", blob, "image.png");
  } else {
    throw new Error("Invalid image format: must be URL or data URL");
  }

  formData.append("prompt", input.prompt);
  formData.append("model", input.model || "grok-2-image");
  formData.append("n", String(input.n || 1));

  const response = await fetch(`${XAI_API_URL}/images/edits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      // Don't set Content-Type - let fetch set it with the boundary for multipart
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`xAI API error (${response.status}): ${errorText}`);
  }

  const result: XAIImageEditOutput = await response.json();

  if (!result.data?.[0]) {
    throw new Error("No image returned from xAI");
  }

  const imageData = result.data[0];

  // Handle both URL and base64 responses
  if (imageData.url) {
    return { url: imageData.url };
  }

  if (imageData.b64_json) {
    // Return as data URL for base64 responses
    return { url: `data:image/png;base64,${imageData.b64_json}` };
  }

  throw new Error("Invalid response format from xAI");
}

// ============================================================================
// Video Generation
// ============================================================================

/**
 * Submit a video generation request to xAI.
 * Returns a request ID that can be used to poll for completion.
 */
export async function generateVideo(
  input: XAIVideoInput
): Promise<XAIVideoSubmitResponse> {
  return xaiRequest<XAIVideoSubmitResponse>("/video/generations", {
    method: "POST",
    body: JSON.stringify({
      prompt: input.prompt,
      model: input.model || "grok-2-video",
      image_url: input.image_url,
      duration: input.duration || 5,
      aspect_ratio: input.aspect_ratio || "16:9",
    }),
  });
}

/**
 * Check the status of a video generation request.
 */
export async function getVideoStatus(
  requestId: string
): Promise<XAIVideoStatusResponse> {
  return xaiRequest<XAIVideoStatusResponse>(`/video/generations/${requestId}`, {
    method: "GET",
  });
}

/**
 * Poll for video generation completion.
 * Throws an error if the video generation fails.
 */
export async function pollVideoUntilComplete(
  requestId: string,
  options: {
    pollIntervalMs?: number;
    maxPollAttempts?: number;
    onProgress?: (status: XAIVideoStatusResponse) => void;
  } = {}
): Promise<{ video_url: string }> {
  const {
    pollIntervalMs = 5000, // 5 seconds
    maxPollAttempts = 120, // 10 minutes max (120 * 5s)
    onProgress,
  } = options;

  let attempts = 0;

  while (attempts < maxPollAttempts) {
    const status = await getVideoStatus(requestId);

    if (onProgress) {
      onProgress(status);
    }

    if (status.status === "completed" && status.video_url) {
      return { video_url: status.video_url };
    }

    if (status.status === "failed") {
      throw new Error(
        `xAI video generation failed: ${status.error || "Unknown error"}`
      );
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    attempts++;
  }

  throw new Error("xAI video generation timed out");
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert an image URL to base64 for xAI API.
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = response.headers.get("content-type") || "image/jpeg";

  return `data:${contentType};base64,${base64}`;
}

/**
 * Map Fal.ai aspect ratio to xAI aspect ratio.
 * Returns the closest matching xAI aspect ratio.
 */
export function mapAspectRatioToXAI(
  falAspectRatio: "16:9" | "9:16" | "1:1"
): "16:9" | "4:3" | "1:1" | "9:16" | "3:4" | "3:2" | "2:3" {
  // xAI supports all the Fal.ai ratios directly
  return falAspectRatio;
}
