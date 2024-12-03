import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

// app/signin/page.tsx
export const metadata: Metadata = {
  title: "Sign In | Mabel Mania",
  description:
    "Sign in to your Mabel Mania account to explore and buy exquisite furniture from around the world. Fast, secure, and easy.",
  keywords:
    "furniture, buy furniture, sell furniture, Mabel Mania, furniture marketplace, global furniture",
  authors: [{ name: "Arfad Muzali" }],
  openGraph: {
    title: "Sign In | Mabel Mania",
    description:
      "Sign in to access the world's largest marketplace for buying and selling premium furniture.",
    siteName: "Mabel Mania",
    //   images: [
    //     {
    //       width: 1200,
    //       height: 630,
    //       alt: "Sign In to Mabel Mania",
    //     },
    //   ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Mabel Mania",
    description:
      "Access your account on Mabel Mania, the global marketplace for furniture enthusiasts.",
  },
};

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <main
      className="flex bg-no-repeat bg-cover bg-center flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('/images/signin-image.webp')",
      }}
    >
      <div className="bg-white/80 rounded-md p-5 gap-3 flex flex-col items-center backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="max-w-[40vw] text-center mb-4 text-sm font-semibold text-neutral-700">
          Sign in to your Mabel Mania account to explore and buy exquisite
          furniture from around the world. Fast, secure, and easy.
        </p>
        <Button
          onClick={async () => {
            "use server";
            await signIn("google");
          }}
          className="w-full flex gap-2 "
          variant={"outline"}
        >
          Sign In With Google{" "}
          <div className="h-4 w-4 relative">
            <Image
              src={"/icon/google.svg"}
              alt="google"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </Button>
      </div>
    </main>
  );
}
