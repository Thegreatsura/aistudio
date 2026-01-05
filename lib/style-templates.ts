export type StyleCategory = "staging" | "lighting" | "exterior" | "atmosphere"

export interface StyleTemplate {
  id: string
  name: string
  description: string
  category: StyleCategory
  thumbnail: string
  prompt: string
  estimatedCost: number
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean lines, neutral tones, contemporary furniture",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop",
    prompt:
      "Professional real estate photo with modern minimalist staging. Add contemporary furniture with clean lines, neutral color palette of whites, grays, and natural wood tones. Ensure the space looks spacious, bright, and move-in ready. Maintain architectural details and natural lighting.",
    estimatedCost: 0.039,
  },
  {
    id: "luxury-high-end",
    name: "Luxury High-End",
    description: "Premium furnishings, rich textures, elegant styling",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    prompt:
      "Transform into a luxury high-end property photo. Add premium furniture pieces, rich textures like velvet and marble, elegant lighting fixtures, and sophisticated decor. Include tasteful art and accessories. The style should evoke wealth and exclusivity while remaining tasteful.",
    estimatedCost: 0.039,
  },
  {
    id: "warm-cozy",
    name: "Warm & Cozy",
    description: "Inviting atmosphere with soft textures and warm lighting",
    category: "atmosphere",
    thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
    prompt:
      "Create a warm and cozy atmosphere. Add comfortable furniture with soft textures, warm lighting from lamps and natural light, plush rugs, and homey accessories like throw blankets and pillows. Colors should be warm earth tones. The space should feel inviting and livable.",
    estimatedCost: 0.039,
  },
  {
    id: "twilight-exterior",
    name: "Twilight Exterior",
    description: "Golden hour lighting with dramatic sky",
    category: "exterior",
    thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    prompt:
      "Transform this exterior photo to twilight/golden hour lighting. Add a warm, dramatic sky with soft oranges and purples. Enable interior lights to create a warm glow from windows. Enhance landscaping visibility and add subtle outdoor lighting. The result should look like a professional twilight real estate photo.",
    estimatedCost: 0.039,
  },
  {
    id: "professional-lighting",
    name: "Professional Lighting",
    description: "Balanced exposure, enhanced natural light",
    category: "lighting",
    thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    prompt:
      "Enhance this photo with professional real estate lighting. Balance all exposures, brighten dark corners, enhance window views without blowing out highlights. Add subtle fill light to shadows. Colors should be accurate and vibrant. The result should look like a professional HDR real estate photo.",
    estimatedCost: 0.039,
  },
]

export function getTemplateById(id: string): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: StyleCategory): StyleTemplate[] {
  return STYLE_TEMPLATES.filter((t) => t.category === category)
}

export const ALL_CATEGORIES: StyleCategory[] = ["staging", "lighting", "exterior", "atmosphere"]
