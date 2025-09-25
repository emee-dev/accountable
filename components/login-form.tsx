"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import freezingEyes from "@/components/lottie/freezing-eyes.json";
import Lottie from "react-lottie";
import Image from "next/image";
import { useState } from "react";
import { GithubIconLight } from "./icons/github-icon-light";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: freezingEyes,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  //   const { isLoading, isAuthenticated } = useConvexAuth();
  const signUp = useMutation(api.auth.userSignUp);
  const [shouldRickRoll, setShouldRickRoll] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onRequest: (x) => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
        },
        onError: async (ctx) => {
          setLoading(false);
          console.log(ctx);
          // console.error(ctx.error);
          // console.error("response", ctx.response);
          // toast.error(ctx.error.message);
        },
      }
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // await new Promise((resolve) => setTimeout(resolve, 1500));

    const x = await signUp({
      email,
      name,
      password,
    });

    console.log(x);

    // await handleSignUp({
    //   name,
    //   email,
    //   password,
    // });

    // console.log({ name, email, password });

    // setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        {!shouldRickRoll && (
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Acme Inc account
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="name"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" className="w-full">
                    <GithubIconLight />
                    <span className="sr-onlyx">Github</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => setShouldRickRoll(true)}
                  >
                    <div>
                      <Image src="/of.png" alt="logo" width={20} height={20} />
                    </div>
                    <span className="sr-onlyx">Onlyfans</span>
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>

            <div className="bg-muted relative md:block flex items-center justify-center">
              <Lottie options={defaultOptions} height={400} width={400} />
            </div>
          </CardContent>
        )}

        {shouldRickRoll && (
          <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
            <div className="relative w-full max-w-sm mx-auto">
              <Image
                src="/judging_dog_face_meme.gif"
                alt="Judging dog meme face"
                width={350}
                height={350}
                className="rounded-xl shadow-md mx-auto object-contain"
              />
              <p className="text-center text-muted-foreground mt-3 text-sm">
                🚫 Stop gooning
              </p>
            </div>

            <Button
              className="mt-2"
              variant="secondary"
              onClick={() => setShouldRickRoll(false)}
            >
              Continue without login
            </Button>
          </CardContent>
        )}
      </Card>

      {/* {!shouldRickRoll && (
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      )} */}
    </div>
  );
}
