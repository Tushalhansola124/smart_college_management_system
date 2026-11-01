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

export function AcademicYearStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="rounded-2xl border border-slate-200/80 shadow-sm"
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AcademicYearTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Academic Year
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Start Date
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              End Date
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status
            </TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Created Date
            </TableHead>
            <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-b border-slate-100 last:border-0">
              <TableCell className="py-3.5">
                <Skeleton className="h-4 w-36 rounded-md" />
              </TableCell>
              <TableCell className="py-3.5">
                <Skeleton className="h-4 w-20 rounded-md" />
              </TableCell>
              <TableCell className="py-3.5">
                <Skeleton className="h-4 w-20 rounded-md" />
              </TableCell>
              <TableCell className="py-3.5">
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell className="py-3.5">
                <Skeleton className="h-4 w-20 rounded-md" />
              </TableCell>
              <TableCell className="py-3.5 text-right">
                <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AcademicYearFormSkeleton() {
  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
      <CardContent className="space-y-6 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}