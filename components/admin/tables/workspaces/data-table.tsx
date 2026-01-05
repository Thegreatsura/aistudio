"use client"

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { useAdminWorkspaceFilters } from "@/hooks/use-admin-workspace-filters"
import { useImpersonation } from "@/hooks/use-impersonation"
import { getWorkspacesPage, type AdminWorkspace } from "@/lib/mock/admin-workspaces"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { createWorkspaceColumns } from "./columns"
import { WorkspaceVirtualRow } from "./virtual-row"
import { WorkspacesTableToolbar } from "./table-toolbar"
import { WorkspacesTableHeader } from "./table-header"
import { IconLoader2, IconBuildingOff } from "@tabler/icons-react"

const ROW_HEIGHT = 64

export function WorkspacesDataTable() {
  const parentRef = useRef<HTMLDivElement>(null)
  const { startImpersonation } = useImpersonation()

  // Get filters from URL state
  const { workspaceFilters, hasActiveFilters, sortColumn, sortDirection, toggleSort } = useAdminWorkspaceFilters()

  // Defer search to debounce filtering
  const deferredFilters = useDeferredValue(workspaceFilters)

  // Pagination state
  const [pages, setPages] = useState<AdminWorkspace[][]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [filteredTotal, setFilteredTotal] = useState(0)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Create columns with impersonation handler
  const columns = useMemo(
    () => createWorkspaceColumns((user) => {
      startImpersonation(user)
    }),
    [startImpersonation]
  )

  // Reset pagination when filters change
  useEffect(() => {
    const response = getWorkspacesPage(null, 20, deferredFilters)
    setPages([response.data])
    setCursor(response.meta.cursor)
    setHasNextPage(response.meta.hasMore)
    setFilteredTotal(response.meta.filteredTotal)
    setIsInitialLoad(false)
  }, [deferredFilters])

  // Flatten all pages into single array
  const tableData = useMemo(() => pages.flat(), [pages])

  // Fetch next page function
  const fetchNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return

    setIsFetchingNextPage(true)

    setTimeout(() => {
      const response = getWorkspacesPage(cursor, 20, deferredFilters)
      setPages((prev) => [...prev, response.data])
      setCursor(response.meta.cursor)
      setHasNextPage(response.meta.hasMore)
      setFilteredTotal(response.meta.filteredTotal)
      setIsFetchingNextPage(false)
    }, 300)
  }, [cursor, hasNextPage, isFetchingNextPage, deferredFilters])

  // Set up TanStack Table
  const table = useReactTable({
    data: tableData,
    getRowId: (row) => row.id,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

  // Set up row virtualization
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  })

  // Infinite scroll hook
  useInfiniteScroll({
    scrollRef: parentRef,
    rowVirtualizer,
    rowCount: rows.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 10,
  })

  // Loading skeleton state
  if (isInitialLoad) {
    return (
      <div className="space-y-4">
        <WorkspacesTableToolbar />
        <div className="relative overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
          {/* Skeleton Header */}
          <div className="flex items-center gap-4 border-b px-4 py-3">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-20" />
          </div>
          {/* Skeleton Rows */}
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-4"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-3 w-28" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="skeleton h-7 w-7 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <div className="skeleton h-3.5 w-24" />
                    <div className="skeleton h-3 w-32" />
                  </div>
                </div>
                <div className="skeleton h-5 w-8 rounded-full" />
                <div className="skeleton h-4 w-12" />
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-4 w-14" />
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
          {/* Skeleton Footer */}
          <div className="border-t px-4 py-3">
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (tableData.length === 0 && !hasActiveFilters) {
    return (
      <div className="space-y-4">
        <WorkspacesTableToolbar />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: "color-mix(in oklch, var(--accent-violet) 15%, transparent)" }}
          >
            <IconBuildingOff className="h-6 w-6" style={{ color: "var(--accent-violet)" }} />
          </div>
          <h3 className="text-lg font-semibold">No workspaces yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Workspaces will appear here once users create them.
          </p>
        </div>
      </div>
    )
  }

  // No results with filters
  if (tableData.length === 0 && hasActiveFilters) {
    return (
      <div className="space-y-4">
        <WorkspacesTableToolbar />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <IconBuildingOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No matching workspaces</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    )
  }

  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <div className="space-y-4">
      <WorkspacesTableToolbar />

      <div className="relative overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
        {/* Table Header */}
        <div className="border-b border-border">
          <Table>
            <WorkspacesTableHeader
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={toggleSort}
            />
          </Table>
        </div>

        {/* Scrollable body with virtualization */}
        <div
          ref={parentRef}
          className="overflow-auto scrollbar-thin"
          style={{ height: "calc(100vh - 400px)", minHeight: "300px" }}
        >
          <Table>
            <TableBody
              className="block relative"
              style={{ height: rowVirtualizer.getTotalSize() }}
            >
              {virtualItems.length > 0 ? (
                virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  if (!row) return null

                  return (
                    <WorkspaceVirtualRow
                      key={row.id}
                      row={row}
                      virtualStart={virtualRow.start}
                      rowHeight={ROW_HEIGHT}
                    />
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Loading indicator */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
            </div>
          )}
        </div>

        {/* Footer with count */}
        <div className="border-t px-4 py-3 text-sm text-muted-foreground">
          <span
            className="font-mono font-semibold"
            style={{ color: "var(--accent-violet)" }}
          >
            {tableData.length}
          </span>
          {" "}of {filteredTotal} workspaces
          {hasNextPage && " (scroll for more)"}
        </div>
      </div>
    </div>
  )
}
