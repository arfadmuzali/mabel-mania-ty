import { Skeleton } from "../ui/skeleton";

export default function StoreCardSkeleton() {
  return (
    <div className="lg:w-[17rem] md:w-56 w-full rounded-lg space-y-1 border">
      <div className="flex w-full flex-col gap-3 p-2">
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/6" />
        <Skeleton className="h-3 w-2/4 mt-5" />
      </div>
    </div>
  );
}
