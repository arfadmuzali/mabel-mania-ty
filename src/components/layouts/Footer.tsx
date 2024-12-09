import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="lg:px-20 p-4 border-t border-neutral-300 mt-16 md:px-12 ">
      <div className="max-w-7xl mx-auto">
        {/* top */}
        <div className="flex items-start lg:flex-row flex-col lg:gap-20 gap-10">
          <Link
            href={"/"}
            className="flex gap-2 rounded-full min-w-max justify-center items-center "
          >
            <div className="relative w-10 h-10">
              <Image
                alt="icon"
                src={"/icon/furniture.png"}
                //   height={20}
                //   width={20}
                fill
                // objectFit="cover"
                style={{ objectFit: "cover" }}
                className="bg-yellow-500 p-2 rounded-full"
              />
            </div>
            <span className="text-lg font-bold ">Mabel Mania</span>
          </Link>
          <div className="flex gap-10 justify-between md:flex-row flex-col w-full ">
            <div className="flex flex-col gap-2 font-semibold text-neutral-800 ">
              <h2 className="text-lg font-bold text-neutral-950 mb-2">Pages</h2>
              <Link
                href={"/"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Home
              </Link>
              <Link
                href={"/products"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Products
              </Link>
              <Link
                href={"/stores"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Stores
              </Link>
              <Link
                href={"/dashboard"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Dashboard
              </Link>
            </div>

            <div className="flex flex-col gap-2 font-semibold text-neutral-800 ">
              <h2 className="text-lg font-bold text-neutral-950 mb-2">
                Social
              </h2>
              <Link
                href={"https://www.instagram.com/arfadmuzali"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Instagram
              </Link>
              <Link
                href={"https://github.com/arfadmuzali"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Github
              </Link>
              <Link
                href={
                  "https://www.linkedin.com/in/arfad-muzali-91a16a2a7?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bec7XjP3mQrul9OvtGKL6IA%3D%3D"
                }
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Linkedin
              </Link>
              <Link
                href={"https://x.com/arfad234"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                X
              </Link>
            </div>

            <div className="flex flex-col gap-2 font-semibold text-neutral-800 ">
              <h2 className="text-lg font-bold text-neutral-950 mb-2">
                Credits
              </h2>
              <Link
                href={"https://skateshop.sadmn.com/"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Skateshop
              </Link>
              <Link
                href={"https://skaters-inifarhan.vercel.app/"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Skaters
              </Link>
            </div>

            <div className="flex flex-col gap-2 font-semibold text-neutral-800 ">
              <h2 className="text-lg font-bold text-neutral-950 mb-2">Music</h2>
              <Link
                href={"https://youtu.be/PslcEKLfNMo?si=9pakuGxtJMfUWCla"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Aragoto (best song ever)
              </Link>
              <Link
                href={"https://youtu.be/hP6VM6YAMIE?si=HpsYRczX-blziD4K"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Black Catcher
              </Link>
              <Link
                href={"https://youtu.be/XiWOsrfHIiI?si=PxFHrxl7U7WOYeLk"}
                className="hover:text-neutral-700 transition-colors duration-150"
              >
                Bling-Bang-Bang-Born
              </Link>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="py-4 flex items-center justify-between">
          <p className="md:text-base text-sm text-neutral-900">
            Build by{" "}
            <Link
              href={"#"}
              className="font-bold text-neutral-800 hover:underline decoration-neutral-400"
            >
              Arfad
            </Link>
          </p>
          <Link
            href={"https://github.com/arfadmuzali"}
            className=" p-2 hover:bg-neutral-400 rounded-md transition-colors duration-300"
          >
            <Github />
          </Link>
        </div>
      </div>
    </div>
  );
}
