import prisma from "@/lib/prisma";
import Link from "next/link";

const cache = new Map<string, { count: number; timestamp: number }>();

async function getCountProduct(slug: string) {
  try {
    const cacheKey = `product-count-${slug}`;
    const cachedData = cache.get(cacheKey);
    const cacheDuration = 1000 * 60 * 60; // Cache duration in milliseconds (1 hour)

    // Check if the cached data is valid (within the cache duration)
    if (cachedData && Date.now() - cachedData.timestamp < cacheDuration) {
      return cachedData.count; // Return cached value if it's still valid
    }

    // Fetch product count from the database if no valid cache
    const product = await prisma.category.findUnique({
      where: {
        slug: slug,
      },
      select: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const count = product?._count.products || 0;

    // Cache the fetched result
    cache.set(cacheKey, { count, timestamp: Date.now() });

    return count;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

const CategoryCard = async ({
  category,
}: {
  category: {
    slug: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    name: string;
  };
}) => {
  const productCount = await getCountProduct(category.slug);
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex justify-center items-center flex-col md:gap-2 gap-1 hover:bg-yellow-500 hover:shadow-none transition-all duration-300 bg-white md:py-12 py-8 border rounded-md shadow-md lg:w-[16.5rem] md:w-80 w-[9.3rem]"
    >
      <category.icon
        // size={42}
        strokeWidth={2}
        className="md:w-12 md:h-12 w-8 h-8 text-yellow-950"
      />
      <span className="text-yellow-600 group-hover:text-white md:text-2xl text-lg font-bold">
        {category.name}
      </span>
      <span className="text-yellow-600 group-hover:text-white text-sm ">
        {productCount} products
      </span>
    </Link>
  );
};

export default CategoryCard;
