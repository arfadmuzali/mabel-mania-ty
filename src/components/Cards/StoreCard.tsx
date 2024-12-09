import { Store } from "@prisma/client";
import Link from "next/link";
import { TooltipWraper } from "../ui/tooltip";
import { Box } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoreCard({
  store,
  isLarge = false,
}: {
  store: Store & {
    _count: {
      product: number;
    };
  };
  isLarge?: boolean;
}) {
  return (
    <Link
      href={"/store/" + store.id}
      className={cn(
        isLarge ? "lg:w-[18rem]" : "lg:w-[17rem]",
        "grow md:w-56 w-full rounded-lg space-y-1 border border-neutral-300 hover:border-neutral-200 hover:shadow-none transition duration-200 shadow-md flex flex-col gap-6 p-4"
      )}
    >
      <div className="flex flex-col gap-2">
        <TooltipWraper tooltip={store.name}>
          <h2 className="line-clamp-1 text-base font-bold">{store.name}</h2>
        </TooltipWraper>
        <p className="line-clamp-2 min-h-8 text-sm">{store.description}</p>
      </div>
      <div className="flex gap-2 font-semibold items-center text-yellow-600">
        <Box strokeWidth={2} /> <span>{store._count.product} product</span>
      </div>
    </Link>
  );
}
