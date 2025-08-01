import { Skeleton } from "@/components/ui/skeleton"

export default function OrganisationLoading() {
  return (
    <div className="flex flex-col space-y-3 p-4 md:p-6">
      <Skeleton className="h-[40px] w-[200px] rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
      </div>
    </div>
  )
}
