import Onboarding from "@/components/Onboarding";
import { Suspense } from "react";

export default async function OnboardingPage() {
  return (
    <main
      className="flex bg-no-repeat bg-cover bg-center flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('/images/signin-image.webp')",
      }}
    >
      <Suspense fallback={<div />}>
        <Onboarding />
      </Suspense>
    </main>
  );
}
