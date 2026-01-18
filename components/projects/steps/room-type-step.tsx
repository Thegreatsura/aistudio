"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UploadedImage } from "@/hooks/use-project-creation";
import {
  getRoomTypeDisplay,
  ROOM_TYPE_OPTIONS,
  type RoomType,
} from "@/lib/room-types";
import { cn } from "@/lib/utils";

interface RoomTypeStepProps {
  images: UploadedImage[];
  onUpdateRoomType: (id: string, roomType: string) => void;
}

export function RoomTypeStep({ images, onUpdateRoomType }: RoomTypeStepProps) {
  const assignedCount = images.filter((image) => image.roomType).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Assign a room type to each image so the AI can generate accurate
          prompts.
        </p>
        <span className="text-muted-foreground text-xs">
          {assignedCount}/{images.length} assigned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div
            className="group relative animate-fade-in-up overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/5"
            key={image.id}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={image.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                src={image.preview}
              />
              {image.roomType && (
                <div className="absolute top-2 right-2 rounded-full bg-[var(--accent-teal)] px-2 py-0.5 font-medium text-white text-xs">
                  {getRoomTypeDisplay(image.roomType as RoomType)}
                </div>
              )}
            </div>

            <div className="p-2">
              <Select
                onValueChange={(value) => onUpdateRoomType(image.id, value)}
                value={image.roomType || ""}
              >
                <SelectTrigger
                  className={cn(
                    "h-8 text-xs",
                    !image.roomType && "text-muted-foreground"
                  )}
                >
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_OPTIONS.map((roomType) => (
                    <SelectItem
                      className="text-xs"
                      key={roomType.id}
                      value={roomType.id}
                    >
                      {roomType.emoji
                        ? `${roomType.emoji} ${roomType.label}`
                        : roomType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
