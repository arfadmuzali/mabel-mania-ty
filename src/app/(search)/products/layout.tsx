import { ReactNode, Suspense } from "react";

export default function ProductsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="lg:px-20 p-4 md:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <h4 className="font-semibold text-neutral-600">
            Buy products from our store
          </h4>
        </div>
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
}
