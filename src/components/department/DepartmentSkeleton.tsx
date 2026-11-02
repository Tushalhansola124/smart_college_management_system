// components/department/DepartmentSkeleton.tsx
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
import { Separator } from "@base-ui/react";

export function DepartmentStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="rounded-xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DepartmentTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-32" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead className="text-right"><Skeleton className="ml-auto h-4 w-12" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-36 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="text-right">
                 <Skeleton className="ml-auto h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DepartmentViewSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-9xl overflow-hidden rounded-2xl border-slate-200 shadow-md">
      {/* Skeleton for Header section */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </div>

      {/* Skeleton for Content section */}
      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
           <div className="sm:col-span-2 lg:col-span-3 mb-2">
             <Skeleton className="h-5 w-32 rounded-md" />
           </div>

          {/* Skeleton Fields */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>
          ))}

          <div className="col-span-1 mt-4 sm:col-span-2 lg:col-span-3">
            <Separator className="mb-6" />
            <Skeleton className="h-5 w-40 rounded-md mb-4" />
          </div>

          {/* Skeleton Description Box */}
          <div className="col-span-1 space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:col-span-2 lg:col-span-3">
             <Skeleton className="h-3 w-24 rounded-full" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
             </div>
          </div>

          {/* Skeleton Dates */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}