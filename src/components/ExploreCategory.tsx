import {
  ArmchairIcon,
  Bed,
  ChefHatIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import CategoryCard from "./Cards/Category-card";

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    product: 0,
    icon: ArmchairIcon,
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    product: 0,
    icon: Bed,
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    product: 0,
    icon: ChefHatIcon,
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    product: 0,
    icon: UtensilsCrossedIcon,
  },
];

export default function ExploreCategory() {
  return (
    <div className="w-full flex flex-col lg:px-28 md:px-12 px-4">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        <h2 className="text-yellow-700 md:text-3xl text-2xl font-extrabold text-center">
          Explore By Category
        </h2>
        <p className="text-center text-yellow-600/70 font-semibold ">
          Explore categories that simplify your search for quality furniture.
        </p>
        <div className="w-full">
          <div className="flex w-full justify-between gap-y-4 flex-wrap items-center">
            {categories.map((category) => {
              return <CategoryCard key={category.slug} category={category} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
