"use client"

import { useState } from "react"
import { IconSparkles, IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ProjectsGrid } from "@/components/dashboard/projects-grid"
import { EmptyProjects } from "@/components/dashboard/empty-projects"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { NewProjectDialog } from "@/components/projects/new-project-dialog"
import { getProjects, getProjectStats } from "@/lib/mock/projects"

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: projects } = getProjects()
  const stats = getProjectStats()

  const hasProjects = projects.length > 0

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Page header with icon badge */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
              style={{ backgroundColor: "var(--accent-teal)" }}
            >
              <IconSparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
              <p className="text-sm text-muted-foreground">
                Transform your real estate photos with AI
              </p>
            </div>
          </div>

          {/* New Project Button */}
          {hasProjects && (
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2 shadow-sm"
              style={{ backgroundColor: "var(--accent-teal)" }}
            >
              <IconPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Project</span>
            </Button>
          )}
        </div>
      </div>

      {hasProjects ? (
        <>
          {/* Stats bar */}
          <StatsBar
            totalProperties={stats.totalProjects}
            activeProperties={stats.completedProjects}
            totalEdits={stats.totalImages}
            totalCost={stats.totalCost}
          />

          {/* Projects grid */}
          <div className="animate-fade-in-up stagger-3">
            <ProjectsGrid projects={projects} />
          </div>
        </>
      ) : (
        /* Empty state */
        <EmptyProjects onCreateClick={() => setDialogOpen(true)} />
      )}

      {/* New Project Dialog */}
      <NewProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
