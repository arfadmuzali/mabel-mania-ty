import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Categories data
export const CATEGORIES = [
  { name: "Living Room", slug: "living-room" },
  { name: "Bedroom", slug: "bedroom" },
  { name: "Kitchen", slug: "kitchen" },
  { name: "Dining Room", slug: "dining-room" },
  { name: "Others", slug: "others" },
];

async function main() {
  const userId = "cm456erog0001pyvkjjrjodac"; // login first to get the id

  // Create a Store
  const store = await prisma.store.create({
    data: {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      userId: userId,
    },
  });
  console.log("Store created:", store);

  // Create Categories from CATEGORIES constant
  const categories = await Promise.all(
    CATEGORIES.map((category) =>
      prisma.category.create({
        data: {
          slug: category.slug,
          name: category.name,
        },
      })
    )
  );
  console.log("Categories created:", categories);

  // Create 4 Products with 1 Image each, and assign each product to a random category
  const products = await Promise.all(
    Array.from({ length: 4 }).map(async () => {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const product = await prisma.product.create({
        data: {
          slug: faker.helpers
            .slugify(faker.commerce.productName())
            .toLowerCase(),
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.number.int({ min: 100, max: 1000 }), // Harga antara 100 dan 100,000
          categorySlug: randomCategory.slug,
          storeId: store.id,
        },
      });

      console.log("Product created:", product);

      // Create 1 Image for the product
      const image = await prisma.image.create({
        data: {
          url: faker.image.urlLoremFlickr(), // Random image URL
          productId: product.id,
        },
      });

      console.log("Image created for product:", product.id, image);

      return product;
    })
  );

  console.log("Products created with images:", products);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
