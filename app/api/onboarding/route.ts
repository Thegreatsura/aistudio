import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, workspace } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    // Validate session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const {
      name,
      workspaceName,
      organizationNumber,
      contactEmail,
      contactPerson,
    } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!workspaceName?.trim()) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    // Get current user to find workspace
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser.length || !currentUser[0].workspaceId) {
      return NextResponse.json(
        { error: "User or workspace not found" },
        { status: 404 }
      );
    }

    const workspaceId = currentUser[0].workspaceId;

    // Update user name if changed
    if (name !== session.user.name) {
      await db
        .update(user)
        .set({ name, updatedAt: new Date() })
        .where(eq(user.id, session.user.id));
    }

    // Update workspace with all details
    await db
      .update(workspace)
      .set({
        name: workspaceName,
        organizationNumber: organizationNumber || null,
        contactEmail: contactEmail || null,
        contactPerson: contactPerson || null,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
