import Link from "next/link";

export default function Hero() {
  return (
    <div
      style={{
        backgroundImage: `url("/images/image-furniture.webp")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="inset-0 h-screen grid place-items-center"
    >
      <div className="p-8 lg:space-y-4 space-y-3 bg-white/30 backdrop-blur lg:m-32 m-4 md:m-16 ">
        <p className="text-2xl lg:text-5xl md:text-3xl text-neutral-800 font-extrabold text-center">
          An e-commerce furniture shop build by{" "}
          <span className="text-yellow-700">Arfad Muzali</span>
        </p>
        <p className="text-center lg:text-lg text-sm md:text-base font-semibold">
          Buy and sell furniture all over the world
        </p>
        <div className="flex justify-center items-center gap-4">
          <Link
            href={"/products"}
            className="bg-yellow-700 text-neutral-50 hover:bg-yellow-800/90 h-10 px-4 py-2 rounded-md font-semibold"
          >
            Buy now
          </Link>
          <Link
            href={"/dashboard"}
            className="bg-white text-neutral-900 hover:bg-neutral-100/90 h-10 px-4 py-2 border border-neutral-300 rounded-md font-semibold"
          >
            Sell Now
          </Link>
        </div>
      </div>
    </div>
  );
}
