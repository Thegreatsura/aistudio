"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OnboardingFormProps {
  initialName: string;
  initialEmail: string;
  initialWorkspaceName: string;
}

export function OnboardingForm({
  initialName,
  initialEmail,
  initialWorkspaceName,
}: OnboardingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(initialName);
  const [workspaceName, setWorkspaceName] = useState(initialWorkspaceName);
  const [organizationNumber, setOrganizationNumber] = useState("");
  const [contactEmail, setContactEmail] = useState(initialEmail);
  const [contactPerson, setContactPerson] = useState(initialName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!workspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }

    // Validate Norwegian org number format if provided (9 digits)
    if (organizationNumber && !/^\d{9}$/.test(organizationNumber)) {
      toast.error("Organization number must be 9 digits");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          workspaceName,
          organizationNumber: organizationNumber || null,
          contactEmail: contactEmail || null,
          contactPerson: contactPerson || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete onboarding");
      }

      toast.success("Welcome to AI Studio!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Complete your profile</CardTitle>
        <CardDescription>
          Tell us a bit more about you and your company
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspaceName">Company / Workspace name</Label>
            <Input
              id="workspaceName"
              type="text"
              placeholder="Acme Real Estate"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationNumber">
              Organization number{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="organizationNumber"
              type="text"
              placeholder="123456789"
              value={organizationNumber}
              onChange={(e) =>
                setOrganizationNumber(e.target.value.replace(/\D/g, ""))
              }
              maxLength={9}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Norwegian organization number (9 digits)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Contact email{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">
              Contact person{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="contactPerson"
              type="text"
              placeholder="John Doe"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <IconLoader className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue to dashboard"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
