import ExploreCategory from "@/components/ExploreCategory";
import FeaturedProduct from "@/components/FeaturedProduct";
import FeaturedStore from "@/components/FeaturedStore";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="space-y-14">
      <Hero />
      <ExploreCategory />
      <FeaturedProduct />
      <FeaturedStore />
    </div>
  );
}
