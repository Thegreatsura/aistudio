import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, workspace } from "@/lib/db/schema";

export async function PATCH(request: Request) {
  try {
    // Validate session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user to find workspace
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser.length || !currentUser[0].workspaceId) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    if (currentUser[0].role !== "owner" && currentUser[0].role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const workspaceId = currentUser[0].workspaceId;

    // Get request body
    const body = await request.json();
    const { name, organizationNumber, contactEmail, contactPerson } = body;

    // Update workspace
    const [updated] = await db
      .update(workspace)
      .set({
        name: name || undefined,
        organizationNumber: organizationNumber ?? undefined,
        contactEmail: contactEmail ?? undefined,
        contactPerson: contactPerson ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId))
      .returning();

    return NextResponse.json({ workspace: updated });
  } catch (error) {
    console.error("Workspace update error:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}
