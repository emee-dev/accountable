"use client";

import Logo from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { isProd } from "@/lib/utils";
import { Authenticated, useMutation } from "convex/react";
import { ChevronsUpDown, Loader2, LogOutIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select as SelectPrimitive } from "radix-ui";
import { useState } from "react";
import { toast } from "sonner";
import { DocSearch } from "../doc-search";
import { ThemeToggler } from "../magicui/theme-toggler";

function getInitials(name: string): string {
  if (!name) return "";
  return name.slice(0, 2).toUpperCase();
}

export default function Navbar(props: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("view") ?? "twitter";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);

    router.push(`?${params.toString()}`);
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-foreground">
                  <Logo />
                </BreadcrumbLink>
              </BreadcrumbItem>

              {!pathname.includes("/tweets/") && !isProd && (
                <BreadcrumbItem>
                  <Select defaultValue={current} onValueChange={handleChange}>
                    <SelectPrimitive.SelectTrigger asChild>
                      <Button
                        variant="ghost"
                        className="focus-visible:bg-accent text-foreground h-8 px-1.5 focus-visible:ring-0"
                      >
                        <SelectValue placeholder="Select project" />
                        <ChevronsUpDown
                          size={14}
                          className="text-muted-foreground/80"
                        />
                      </Button>
                    </SelectPrimitive.SelectTrigger>
                    <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                      <SelectItem value="event">Events</SelectItem>
                      <SelectItem value="twitter">Twitter bookmarks</SelectItem>
                    </SelectContent>
                  </Select>
                </BreadcrumbItem>
              )}

              <Authenticated>
                {!pathname.includes("/tweets/") && (
                  <BreadcrumbItem>
                    <Select defaultValue={current} onValueChange={handleChange}>
                      <SelectPrimitive.SelectTrigger asChild>
                        <Button
                          variant="ghost"
                          className="focus-visible:bg-accent text-foreground h-8 px-1.5 focus-visible:ring-0"
                        >
                          <SelectValue placeholder="Select project" />
                          <ChevronsUpDown
                            size={14}
                            className="text-muted-foreground/80"
                          />
                        </Button>
                      </SelectPrimitive.SelectTrigger>
                      <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                        <SelectItem value="event">Events</SelectItem>
                        <SelectItem value="twitter">
                          Twitter bookmarks
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </BreadcrumbItem>
                )}
              </Authenticated>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grow">
          <Authenticated>
            <DocSearch />
          </Authenticated>
        </div>

        <div className="flex items-center gap-4">
          <Authenticated>
            <TwitterSetup user={props.user} />
          </Authenticated>
          <ThemeToggler />
          <Authenticated>
            {props.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <Avatar>
                      <AvatarImage src="./avatar.jpg" alt="Profile image" />
                      <AvatarFallback>
                        {getInitials(props.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-64" align="end">
                  <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                      {props.user.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                      {props.user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      authClient.signOut();
                    }}
                  >
                    <LogOutIcon
                      size={16}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Authenticated>
        </div>
      </div>
    </header>
  );
}

export function TwitterSetup({ user }: { user: any }) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = useMutation(api.auth.updateUserTwitterId);

  if (user?.twitterId) return null;

  const handleSave = async () => {
    if (!username) {
      toast("Missing username", {
        description: "Please enter your X username before saving.",
      });
      return;
    }

    try {
      setIsLoading(true);

      await updateUser({
        twitterId: username.replace(/^@/, ""),
      });

      toast("Username saved", {
        description: "Your X username has been linked successfully.",
      });
    } catch (error) {
      console.error(error);
      toast("Something went wrong", {
        description: "We couldn’t save your X username. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="text-xs font-medium underline-offset-2 hover:underline"
        >
          Action required
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your X (Twitter) account</DialogTitle>
          <DialogDescription>
            Enter your X username to enable tweet bookmarking and event linking.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="@username"
            value={username}
            disabled={isLoading}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
