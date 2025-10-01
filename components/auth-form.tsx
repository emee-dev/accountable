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
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: freezingEyes,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [shouldRickRoll, setShouldRickRoll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [view, setView] = useState<"signIn" | "signUp" | "forgotPassword">(
    "signIn"
  );

  const handleEmailSignUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    await authClient.signUp.email(
      { name, email, password },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => setLoading(false),
        onError: (ctx) => {
          setLoading(false);
          console.error("SignUp error:", ctx.error.message);
          toast("Oops!!", {
            description: `SignUp error: ${ctx.error.message}`,
          });
        },
      }
    );
  };

  const handleEmailSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => setLoading(false),
        onError: (ctx) => {
          setLoading(false);
          console.error("SignIn error:", ctx.error.message);
          toast("Oops!!", {
            description: `SignIn error: ${ctx.error.message}`,
          });
        },
      }
    );
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => setLoading(false),
        onError: (ctx) => {
          setLoading(false);
          console.error("Github auth error:", ctx.error.message);
          toast("Oops!!", {
            description: `Github auth error: ${ctx.error.message}`,
          });
        },
      }
    );
  };

  const handleAnonymousSignIn = async () => {
    await authClient.signIn.anonymous(
      {},
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setShouldRickRoll(false);
          setLoading(false);
        },
        onError: (ctx) => {
          setLoading(false);
          toast("Oops!!", {
            description: `Anonymous auth error: ${ctx.error.message}`,
          });
        },
      }
    );
  };

  const handleResetPassword = async (email: string) => {
    setForgotLoading(true);
    try {
      await authClient.forgetPassword({
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });
    } catch (err: any) {
      toast("Oops!!", {
        description: `Reset password error: ${err?.message}`,
      });
    } finally {
      setForgotLoading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (view === "signUp") {
      await handleEmailSignUp({
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
    } else if (view === "signIn") {
      await handleEmailSignIn({ email, password });
    } else if (view === "forgotPassword") {
      await handleResetPassword(email);
    }
  }

  const renderHeader = () => {
    switch (view) {
      case "signUp":
        return {
          title: "Create an account",
          subtitle: "Sign up to get started",
        };
      case "forgotPassword":
        return {
          title: "Reset your password",
          subtitle: "Enter your email to receive a reset link",
        };
      default:
        return { title: "Welcome back", subtitle: "Login to your account" };
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        {!shouldRickRoll && (
          <CardContent className="grid p-0 lg:grid-cols-2">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{renderHeader().title}</h1>
                  <p className="text-muted-foreground text-balance">
                    {renderHeader().subtitle}
                  </p>
                </div>

                {/* Sign Up extra fields */}
                {view === "signUp" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                {/* Password */}
                {view !== "forgotPassword" && (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      {view === "signIn" &&
                        (forgotLoading ? (
                          <Button
                            variant="link"
                            className="ml-auto text-sm flex items-center"
                            disabled
                          >
                            Loading
                            <Loader2 className="animate-spin ml-2 size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="link"
                            className="ml-auto text-sm underline-offset-2"
                            onClick={() => setView("forgotPassword")}
                            type="button"
                          >
                            Forgot your password?
                          </Button>
                        ))}
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Your password"
                      required
                    />
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || forgotLoading}
                >
                  {loading || forgotLoading
                    ? "Please wait..."
                    : view === "signUp"
                    ? "Sign up"
                    : view === "forgotPassword"
                    ? "Send reset link"
                    : "Login"}
                </Button>

                {/* OAuth / Extra options */}
                {view !== "forgotPassword" && (
                  <>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={handleGithubSignIn}
                      >
                        <GithubIconLight />
                        <span>Github</span>
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={() => setShouldRickRoll(true)}
                      >
                        <Image
                          src="/of.png"
                          alt="logo"
                          width={20}
                          height={20}
                        />
                        <span>Onlyfans</span>
                      </Button>
                    </div>
                  </>
                )}

                {/* Footer Links */}
                <div className="text-center text-sm">
                  {view === "signUp" ? (
                    <>
                      Already have an account?{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => setView("signIn")}
                      >
                        Login
                      </span>
                    </>
                  ) : view === "signIn" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => setView("signUp")}
                      >
                        Sign up
                      </span>
                    </>
                  ) : (
                    <>
                      Remembered your password?{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => setView("signIn")}
                      >
                        Login
                      </span>
                    </>
                  )}
                </div>
              </div>
            </form>

            <div className="bg-muted relative lg:block hidden items-center justify-center">
              <Lottie options={defaultOptions} height={400} width={400} />
            </div>
          </CardContent>
        )}

        {/* Rick Roll View */}
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
            <div className="flex items-center gap-x-2 mt-3">
              <Button
                variant="secondary"
                onClick={() => setShouldRickRoll(false)}
                size="sm"
              >
                Go back
              </Button>
              <Button
                disabled={loading}
                onClick={handleAnonymousSignIn}
                size="sm"
              >
                {loading ? "Logging in..." : "Sign in anonymously"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
