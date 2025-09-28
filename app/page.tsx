"use client";

import { LoginForm } from "@/components/login-form";
import Navbar from "@/components/originui/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { CalendarIcon, Loader2, Megaphone, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

const bookmarks = [
  {
    id: 1,
    name: "Leslie Alexander",
    date: "January 10th, 2022 at 5:00 PM",
    location: "Starbucks",
    avatar: "/images/leslie-alexander.jpg",
  },
  {
    id: 2,
    name: "Michael Foster",
    date: "January 12th, 2022 at 3:00 PM",
    location: "Tim Hortons",
    avatar: "/images/michael-foster.jpg",
  },
  {
    id: 3,
    name: "Dries Vincent",
    date: "January 12th, 2022 at 5:00 PM",
    location: "Costa Coffee at Braehead",
    avatar: "/images/dries-vincent.jpg",
  },
  {
    id: 4,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
  {
    id: 5,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
  {
    id: 6,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
  {
    id: 7,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
  {
    id: 8,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
  {
    id: 9,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
  {
    id: 10,
    name: "Lindsay Walton",
    date: "January 14th, 2022 at 10:00 AM",
    location: "Silverburn",
    avatar: "/images/lindsay-walton.jpg",
  },
];

const env = process.env.NODE_ENV;

type PageProps = {
  params: Promise<any>;
  searchParams: Promise<{
    eid: string; // eventId
    bid: string; // bookmarkId
    v: "twitter" | "event"; // view
  }>;
};

export default function BookmarksPage(props: PageProps) {
  const params = use(props.searchParams);

  return (
    <div className="min-h-screen bg-muted flex flex-col transition-colors duration-300">
      <div className="flex flex-col gap-8 p-6 w-full lg:max-w-[70%] mx-auto md:max-w-[80%] lg:min-w-3xl">
        <Navbar />
        {/* <Content bid={params.bid} eid={params.eid} v={params.v} /> */}

        {env === "production" && (
          <Authenticated>
            <Content bid={params.bid} eid={params.eid} v={params.v} />
          </Authenticated>
        )}
        {env === "production" && (
          <Unauthenticated>
            <div className="w-full max-w-sm md:max-w-3xl">
              <LoginForm />
            </div>
          </Unauthenticated>
        )}

        {env === "production" && (
          <AuthLoading>
            <div className="flex pt-16 w-full items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Authenticating...
                </p>
              </div>
            </div>
          </AuthLoading>
        )}
      </div>

      {/* <div className="mt-auto mx-auto w-2xl rounded-md border-t border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 text-sm text-muted-foreground font-sans">
          <p>
            Made with <span className="text-red-500">❤</span> by{" "}
            <span className="font-medium text-foreground">Emmanuel</span>
          </p>

          <Link
            href="https://github.com/emee-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <GithubIconLight className="w-5" />
          </Link>
        </div>
      </div> */}
    </div>
  );
}

function Content({ bid, eid, v }: Awaited<PageProps["searchParams"]>) {
  if (!v) {
    return (
      <>
        {!bid && <BookmarkView twitterBookmarks={v} view={v} />}
        {bid && <ContentView bookmarkId={bid} />}
      </>
    );
  }

  if (v === "twitter") {
    return (
      <>
        {!bid && <BookmarkView twitterBookmarks={v} view={v} />}
        {bid && <ContentView bookmarkId={bid} />}
      </>
    );
  }

  if (v === "event") {
    return <>{!eid && <EventsView events={v} />}</>;
  }

  return <div>No content to show</div>;
}

const BookmarkView = (props: { twitterBookmarks: string; view: string }) => {
  const [dropdown, setDropdown] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));

  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="flex lg:hidden">
          <Button variant="outline" className="ml-auto">
            Calendar
          </Button>
        </DialogTrigger>
        <DialogContent className="p-2 w-fit">
          <DialogHeader className="sr-only">
            <DialogTitle>Calendar</DialogTitle>
            <DialogDescription>
              Select a day to see your bookmarks or events for that day.
            </DialogDescription>
          </DialogHeader>
          <div className="p-2">
            <p className="text-sm font-sans">Calendar:</p>
          </div>
          <div className="w-80x text-sm flex flex-col items-center">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              captionLayout={dropdown}
              onSelect={setDate}
              className="rounded-lg border border-input shadow-sm bg-background dark:bg-card transition-colors"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 p-3">
        <h1 className="text-sm mb-8 font-sans text-foreground">Bookmarks:</h1>

        <div className="grid lg:grid-cols-2 gap-x-4">
          <div className="space-y-6 overflow-auto max-h-[384px] scroll-smooth scrollbar-hide">
            {bookmarks.map((bookmark) => (
              <Link
                href={
                  props.view
                    ? `/?bid=${bookmark.id}&v=${props.view}`
                    : `?bid=${bookmark.id}`
                }
                key={bookmark.id}
                className="flex items-start gap-4 group bg-background dark:bg-card/40 
                   rounded-md p-1.5 h-16 font-sans border border-transparent 
                   hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Avatar className="size-8 text-sm ring-1 ring-border/40">
                  <AvatarImage
                    src={bookmark.avatar || "/placeholder.svg"}
                    alt={bookmark.name}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {bookmark.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-2 cursor-pointer group-hover:underline underline-offset-4 text-sm">
                        {bookmark.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{bookmark.date}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity size-8"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Calendar */}
          <div className="hidden w-80x text-sm lg:flex flex-col items-center">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              captionLayout={dropdown}
              onSelect={setDate}
              className="rounded-lg border border-input shadow-sm bg-background dark:bg-card transition-colors"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const EventsView = (props: { events: string }) => {
  const [dropdown, setDropdown] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));

  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="flex lg:hidden">
          <Button variant="outline" className="ml-auto">
            Calendar
          </Button>
        </DialogTrigger>
        <DialogContent className="p-2 w-fit">
          <DialogHeader className="sr-only">
            <DialogTitle>Calendar</DialogTitle>
            <DialogDescription>
              Select a day to see your bookmarks or events for that day.
            </DialogDescription>
          </DialogHeader>
          <div className="p-2">
            <p className="text-sm font-sans">Calendar:</p>
          </div>
          <div className="w-80x text-sm flex flex-col items-center">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              captionLayout={dropdown}
              onSelect={setDate}
              className="rounded-lg border border-input shadow-sm bg-background dark:bg-card transition-colors"
            />
            <div className="pb-2">
              <Button className="w-48 mt-4 shadow-sm hover:shadow-md transition-shadow">
                Add event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 p-3">
        <h1 className="text-sm mb-8 font-sans text-foreground">Events:</h1>

        <div className="grid lg:grid-cols-2 gap-x-4">
          <div className="space-y-6 overflow-auto max-h-[384px] scroll-smooth scrollbar-hide">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-start gap-4 group bg-background dark:bg-card/40 
                   rounded-md p-1.5 h-16 font-sans border border-transparent 
                   hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Avatar className="size-8 text-sm ring-1 ring-border/40">
                  <AvatarImage
                    src={bookmark.avatar || "/placeholder.svg"}
                    alt={bookmark.name}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {bookmark.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-2 cursor-pointer text-sm">
                        {bookmark.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{bookmark.date}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity size-8"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden w-80x text-sm lg:flex flex-col items-center">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              captionLayout={dropdown}
              onSelect={setDate}
              className="rounded-lg border border-input shadow-sm bg-background dark:bg-card transition-colors"
            />

            <Button className="w-48 mt-4 shadow-sm hover:shadow-md transition-shadow">
              Add event
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const ContentView = (props: { bookmarkId: string }) => {
  return (
    <>
      <div className="w-full bg-redx-500 flex">
        <Link href="/" className="ml-auto">
          <Button variant="outline" size="sm">
            Go back
          </Button>
        </Link>
      </div>
      <div className="flex-1 p-3">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-4 overflow-auto max-h-[384px] scroll-smooth scrollbar-hide">
            <div className="space-y-4">
              <p className="text-sm text-foreground flex items-center">
                Summary <Megaphone className="size-5 ml-3" strokeWidth={1.1} />
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed relative ps-4 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted-foreground">
                An insightful thread about sustainable technology practices and
                how companies can reduce their carbon footprint through better
                engineering choices. The discussion covers everything from
                server optimization to green coding practices. optimization to
                green coding practices. optimization to green coding practices.
                optimization to green coding practices. optimization to green
                coding practices. optimization to green coding practices.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-foreground">Original text: </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An insightful thread about sustainable technology practices and
                how companies can reduce their carbon footprint through better
                engineering choices. The discussion covers everything from
                server optimization to green coding practices. optimization to
                green coding practices. optimization to green coding practices.
                optimization to green coding practices. optimization to green
                coding practices. optimization to green coding practices.
              </p>
            </div>
          </div>

          <div className="max-w-sm text-sm flex flex-col items-center gap-4">
            <Image
              src="/tweet.png"
              alt="Tweet screenshot"
              width={400}
              height={400}
              className="rounded-xl border border-input shadow-sm bg-background dark:bg-card transition-colors"
            />

            <div className="flex w-full justify-between gap-2">
              <Button className="flex-1 shadow-sm hover:shadow-md transition-shadow">
                Download
              </Button>
              <Button className="flex-1 shadow-sm hover:shadow-md transition-shadow">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
