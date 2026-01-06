import { eq, desc, count, and } from "drizzle-orm";
import { db } from "./index";
import {
  user,
  workspace,
  imageGeneration,
  type User,
  type Workspace,
  type ImageGeneration,
} from "./schema";

// ============================================================================
// User Queries
// ============================================================================

export async function getUserById(userId: string): Promise<User | null> {
  const result = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return result[0] || null;
}

export async function updateUser(
  userId: string,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<User | null> {
  const result = await db
    .update(user)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning();
  return result[0] || null;
}

// ============================================================================
// Workspace Queries
// ============================================================================

export async function getWorkspaceById(
  workspaceId: string
): Promise<Workspace | null> {
  const result = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, workspaceId))
    .limit(1);
  return result[0] || null;
}

export async function getWorkspaceBySlug(
  slug: string
): Promise<Workspace | null> {
  const result = await db
    .select()
    .from(workspace)
    .where(eq(workspace.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function updateWorkspace(
  workspaceId: string,
  data: Partial<Omit<Workspace, "id" | "createdAt">>
): Promise<Workspace | null> {
  const result = await db
    .update(workspace)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(workspace.id, workspaceId))
    .returning();
  return result[0] || null;
}

export async function getWorkspaceMembers(workspaceId: string): Promise<User[]> {
  return db
    .select()
    .from(user)
    .where(eq(user.workspaceId, workspaceId))
    .orderBy(desc(user.createdAt));
}

// ============================================================================
// Image Generation Queries
// ============================================================================

export async function getImageGenerations(
  workspaceId: string,
  options?: { limit?: number; offset?: number }
): Promise<ImageGeneration[]> {
  const query = db
    .select()
    .from(imageGeneration)
    .where(eq(imageGeneration.workspaceId, workspaceId))
    .orderBy(desc(imageGeneration.createdAt));

  if (options?.limit) {
    query.limit(options.limit);
  }

  if (options?.offset) {
    query.offset(options.offset);
  }

  return query;
}

export async function getImageGenerationById(
  id: string
): Promise<ImageGeneration | null> {
  const result = await db
    .select()
    .from(imageGeneration)
    .where(eq(imageGeneration.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getImageGenerationStats(workspaceId: string): Promise<{
  total: number;
  completed: number;
  processing: number;
  failed: number;
}> {
  const [totalResult] = await db
    .select({ count: count() })
    .from(imageGeneration)
    .where(eq(imageGeneration.workspaceId, workspaceId));

  const [completedResult] = await db
    .select({ count: count() })
    .from(imageGeneration)
    .where(
      and(
        eq(imageGeneration.workspaceId, workspaceId),
        eq(imageGeneration.status, "completed")
      )
    );

  const [processingResult] = await db
    .select({ count: count() })
    .from(imageGeneration)
    .where(
      and(
        eq(imageGeneration.workspaceId, workspaceId),
        eq(imageGeneration.status, "processing")
      )
    );

  const [failedResult] = await db
    .select({ count: count() })
    .from(imageGeneration)
    .where(
      and(
        eq(imageGeneration.workspaceId, workspaceId),
        eq(imageGeneration.status, "failed")
      )
    );

  return {
    total: totalResult?.count || 0,
    completed: completedResult?.count || 0,
    processing: processingResult?.count || 0,
    failed: failedResult?.count || 0,
  };
}

export async function createImageGeneration(
  data: Omit<ImageGeneration, "id" | "createdAt" | "updatedAt">
): Promise<ImageGeneration> {
  const id = crypto.randomUUID();
  const [result] = await db
    .insert(imageGeneration)
    .values({
      ...data,
      id,
    })
    .returning();
  return result;
}

export async function updateImageGeneration(
  id: string,
  data: Partial<Omit<ImageGeneration, "id" | "createdAt">>
): Promise<ImageGeneration | null> {
  const result = await db
    .update(imageGeneration)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(imageGeneration.id, id))
    .returning();
  return result[0] || null;
}

// ============================================================================
// User with Workspace (joined query)
// ============================================================================

export async function getUserWithWorkspace(userId: string): Promise<{
  user: User;
  workspace: Workspace;
} | null> {
  const userResult = await getUserById(userId);
  if (!userResult || !userResult.workspaceId) {
    return null;
  }

  const workspaceResult = await getWorkspaceById(userResult.workspaceId);
  if (!workspaceResult) {
    return null;
  }

  return {
    user: userResult,
    workspace: workspaceResult,
  };
}
