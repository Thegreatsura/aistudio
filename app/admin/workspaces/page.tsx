import { IconBuilding } from "@tabler/icons-react"
import { WorkspacesDataTable } from "@/components/admin/tables/workspaces/data-table"

export default function AdminWorkspacesPage() {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: "var(--accent-violet)" }}
          >
            <IconBuilding className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all workspaces on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="animate-fade-in-up stagger-1">
        <WorkspacesDataTable />
      </div>
    </div>
  )
}
