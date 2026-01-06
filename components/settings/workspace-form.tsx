"use client"

import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import {
  IconBuilding,
  IconHash,
  IconMail,
  IconUser,
  IconDeviceFloppy,
  IconLoader2,
  IconUpload,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Workspace } from "@/lib/db/schema"

interface WorkspaceFormProps {
  workspace: Workspace
}

export function WorkspaceForm({ workspace }: WorkspaceFormProps) {
  const [formData, setFormData] = useState({
    name: workspace.name,
    organizationNumber: workspace.organizationNumber || "",
    contactEmail: workspace.contactEmail || "",
    contactPerson: workspace.contactPerson || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/workspace", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save changes")
      }

      toast.success("Changes saved successfully")
      setHasChanges(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Workspace Logo</Label>
        <div className="flex items-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted ring-1 ring-foreground/5"
            style={{
              background: workspace.logo
                ? `url(${workspace.logo}) center/cover`
                : "linear-gradient(135deg, color-mix(in oklch, var(--accent-teal) 20%, transparent) 0%, color-mix(in oklch, var(--accent-teal) 5%, transparent) 100%)",
            }}
          >
            {!workspace.logo && (
              <IconBuilding
                className="h-8 w-8"
                style={{ color: "var(--accent-teal)" }}
              />
            )}
          </div>
          <div className="space-y-1">
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <IconUpload className="h-4 w-4" />
              Upload Logo
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG, JPG up to 2MB. Recommended 200x200px.
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Workspace Name */}
        <div className="space-y-2">
          <Label htmlFor="workspace-name" className="text-sm font-medium">
            Workspace Name
          </Label>
          <div className="relative">
            <IconBuilding className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="workspace-name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your company name"
              className="pl-10"
            />
          </div>
        </div>

        {/* Organization Number */}
        <div className="space-y-2">
          <Label htmlFor="org-number" className="text-sm font-medium">
            Organization Number
          </Label>
          <div className="relative">
            <IconHash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="org-number"
              value={formData.organizationNumber}
              onChange={(e) => handleChange("organizationNumber", e.target.value)}
              placeholder="123456789"
              className="pl-10"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-sm font-medium">
            Contact Email
          </Label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="contact-email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="contact@company.com"
              className="pl-10"
            />
          </div>
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contact-person" className="text-sm font-medium">
            Contact Person
          </Label>
          <div className="relative">
            <IconUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="contact-person"
              value={formData.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              placeholder="Full name"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {hasChanges ? "You have unsaved changes" : "All changes saved"}
        </p>
        <Button
          type="submit"
          disabled={!hasChanges || isSaving}
          className={cn(
            "gap-2 transition-all",
            hasChanges && "shadow-sm"
          )}
          style={{
            backgroundColor: hasChanges ? "var(--accent-teal)" : undefined,
          }}
        >
          {isSaving ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <IconDeviceFloppy className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
