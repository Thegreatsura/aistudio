"use client"

import * as React from "react"
import Image from "next/image"
import { IconPhoto, IconSparkles, IconCurrencyDollar } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UploadedImage } from "@/hooks/use-project-creation"
import type { StyleTemplate } from "@/lib/style-templates"

interface ConfirmStepProps {
  images: UploadedImage[]
  selectedTemplate: StyleTemplate | null
  projectName: string
  onProjectNameChange: (name: string) => void
  estimatedCost: number
}

export function ConfirmStep({
  images,
  selectedTemplate,
  projectName,
  onProjectNameChange,
  estimatedCost,
}: ConfirmStepProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Left: Image stack preview */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Images</h3>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {/* Stacked image preview */}
          {images.slice(0, 3).map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "absolute inset-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10 transition-transform duration-300"
              )}
              style={{
                transform: `rotate(${(index - 1) * 3}deg) scale(${1 - index * 0.05})`,
                zIndex: 3 - index,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.preview}
                alt={image.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          {/* Image count badge */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <IconPhoto className="h-4 w-4" />
            {images.length} image{images.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="space-y-4">
        {/* Project name */}
        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-sm font-medium">
            Project Name
          </Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="e.g., 123 Main Street"
            className="h-10"
          />
        </div>

        {/* Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Style</Label>
          {selectedTemplate && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 ring-1 ring-foreground/5">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{selectedTemplate.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {selectedTemplate.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cost estimate */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Estimated Cost</Label>
          <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--accent-amber) 15%, transparent)",
                  }}
                >
                  <IconCurrencyDollar
                    className="h-4 w-4"
                    style={{ color: "var(--accent-amber)" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <span
                className="font-mono text-xl font-bold tabular-nums"
                style={{ color: "var(--accent-amber)" }}
              >
                ${estimatedCost.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <IconSparkles className="h-3 w-3" />
              <span>
                {images.length} image{images.length !== 1 ? "s" : ""} × $
                {selectedTemplate?.estimatedCost.toFixed(3) || "0.039"} per image
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
