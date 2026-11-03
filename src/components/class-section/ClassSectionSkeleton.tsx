import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ClassSectionStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="rounded-2xl border border-slate-200/80 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-8 w-14 rounded-md" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ClassSectionTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="h-11 w-14 text-xs font-semibold uppercase tracking-wider text-slate-500">#</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Class / Section</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Department</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Semester</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Academic Year</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">Created Date</TableHead>
            <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-b border-slate-100 last:border-0">
              {Array.from({ length: 9 }).map((__, j) => (
                <TableCell key={j} className="py-3.5">
                  <Skeleton className="h-4 w-full max-w-22.5 rounded-md" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ClassSectionFormSkeleton() {
  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ClassSectionViewSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
        <CardContent className="space-y-6 p-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-5 w-64 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
        <CardContent className="space-y-6 p-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-5 w-64 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}