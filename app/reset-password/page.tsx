"use client";

import freezingEyes from "@/components/lottie/freezing-eyes.json";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: freezingEyes,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ComponentView = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.log("No token found");
      return;
    }

    const form = new FormData(e.currentTarget);

    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await authClient.resetPassword(
      {
        token,
        newPassword: password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          redirect("/");
        },
        onError: (ctx) => {
          setLoading(false);
          alert(ctx.error.message);
        },
      }
    );
  };

  if (!token) {
    return (
      <div className=" w-full flex items-center justify-center p-6 pt-32">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg md:text-xl">Invalid Link</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              This password link is either expired or invalid please request for
              a new one.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-32 gap-8 p-6 w-full lg:max-w-[70%] mx-auto md:max-w-[80%] lg:min-w-3xl">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0 ">
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Reset password</h1>
                    <p className="text-muted-foreground text-balance">
                      Enter your new password
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComponentView;
