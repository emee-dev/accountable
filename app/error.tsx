"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // if you use shadcn/ui
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Oops! </h1>
      <p className="text-gray-600 max-w-md mb-6">
        {error?.message?.toLowerCase().includes("unauthenticated")
          ? "Looks like you’re not signed in. Please log in to continue."
          : "Something unexpected happened. Don’t worry—we’re on it."}
      </p>

      <div className="flex gap-4">
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/">
          <Button size="sm">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
