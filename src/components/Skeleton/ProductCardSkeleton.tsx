import { Skeleton } from "../ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="lg:w-[17rem] md:w-56 w-full rounded-lg space-y-1 border">
      <Skeleton className="w-full rounded-t-lg h-64 md:h-52 lg:h-64" />
      <div className="flex w-full flex-col gap-3 p-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
