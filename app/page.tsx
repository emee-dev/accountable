"use client";

import { AuthForm } from "@/components/auth-form";
import Navbar from "@/components/originui/navbar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { isProd } from "@/lib/utils";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { CalendarClock, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

const events = [
  {
    _id: "6510f0a1c1e8f3d9a1b23401",
    twitterUsername: "frontendweekly",
    label: "Frontend Friday",
    description: "Weekly roundup of frontend news, tutorials, and tools.",
  },
  {
    _id: "6510f0a1c1e8f3d9a1b23402",
    twitterUsername: "devrel_daily",
    label: "DevRel Spaces",
    description:
      "Community-driven Twitter Spaces on developer relations and DX.",
  },
  {
    _id: "6510f0a1c1e8f3d9a1b23403",
    twitterUsername: "oss_lovers",
    label: "Open Source Summit",
    description:
      "A monthly thread highlighting impactful OSS projects and contributors.",
  },
  {
    _id: "6510f0a1c1e8f3d9a1b23404",
    twitterUsername: "aiinsights",
    label: "AI Roundtable",
    description:
      "Bi-weekly discussions on the latest in AI research and tooling.",
  },
  {
    _id: "6510f0a1c1e8f3d9a1b23405",
    twitterUsername: "javascriptlife",
    label: "JS Deep Dive",
    description:
      "Exploring advanced JavaScript topics with code examples and Q&A.",
  },
];

const env = process.env.NODE_ENV;

type PageProps = {
  params: Promise<any>;
  searchParams: Promise<{
    view: "twitter" | "event";
  }>;
};

export default function BookmarksPage(props: PageProps) {
  const params = use(props.searchParams);
  const user = useQuery(
    api.bookmarks.getCurrentUser
    // isProd ? undefined : "skip"
  );

  return (
    <>
      <div className="flex flex-col gap-8 p-4 w-full lg:max-w-[70%] mx-auto md:max-w-[80%] lg:min-w-3xl">
        <Navbar user={user} />

        <Authenticated>
          <Content view={params.view} twitterUsername={user?.twitterId || ""} />
        </Authenticated>

        <Unauthenticated>
          <div className="w-full max-w-sm md:max-w-3xl">
            <AuthForm />
          </div>
        </Unauthenticated>

        <AuthLoading>
          <div className="flex pt-16 w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Authenticating...</p>
            </div>
          </div>
        </AuthLoading>

        {/* {!isProd && (
          <Content view={params.view} twitterUsername={user?.twitterId || ""} />
        )} */}

        {/* {env === "production" && (
          <Authenticated>
            <Content
              view={params.view}
              twitterUsername={user?.twitterId || ""}
            />
          </Authenticated>
        )} */}

        {/* {env === "production" && (
          <Unauthenticated>
            <div className="w-full max-w-sm md:max-w-3xl">
              <AuthForm />
            </div>
          </Unauthenticated>
        )} */}

        {/* {env === "production" && (
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
        )} */}
      </div>
    </>
  );
}

type ContentProps = {
  view: string;
  twitterUsername: string;
};

function Content({ view, twitterUsername }: ContentProps) {
  if (!view) {
    return <TweetList twitterUsername={twitterUsername} />;
  }

  if (view === "twitter") {
    return <TweetList twitterUsername={twitterUsername} />;
  }

  if (view === "event") {
    return <EventsView twitterUsername={twitterUsername} />;
  }

  return <div>No content to show</div>;
}

type TweetListProps = {
  twitterUsername: string;
};

type EventsViewProps = {
  twitterUsername: string;
};

type CaptionLayout = React.ComponentProps<typeof Calendar>["captionLayout"];

const TweetList = ({ twitterUsername }: TweetListProps) => {
  const [dropdown, _] = useState<CaptionLayout>("dropdown");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const {
    results: bookmarks,
    isLoading,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.bookmarks.listBookmarks,
    twitterUsername
      ? {
          twitterUsername,
          date: date?.toISOString() ?? new Date().toISOString(),
        }
      : "skip",
    { initialNumItems: 5 }
  );

  return (
    <>
      {bookmarks.length > 0 && (
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
      )}

      <div className="flex-1 p-3">
        <h1 className="text-sm mb-8 font-sans text-foreground">Bookmarks:</h1>

        <div className="grid lg:grid-cols-2 gap-x-4">
          <div className="space-y-6 overflow-auto max-h-[384px] scroll-smooth scrollbar-hide">
            {isLoading &&
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-md p-2 border border-border/40 shadow-sm"
                >
                  <Skeleton className="size-8 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}

            {!isLoading && bookmarks.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 text-center">
                <p className="text-sm font-medium text-foreground">
                  No bookmarks yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Bookmarked tweets will appear here once you add some.
                </p>
              </div>
            )}

            {bookmarks.map((bookmark, idx) => (
              <Link
                href={`/tweets/${bookmark.tweet.id}`}
                key={bookmark.tweet.id}
                className="flex items-start gap-4 group bg-background dark:bg-card/40 
                   rounded-md p-1.5 h-16 font-sans border border-transparent 
                   hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="size-8 text-sm pl-2 pt-0.5">{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-2 cursor-pointer group-hover:underline underline-offset-4 text-sm">
                        {bookmark.replyingTo.userName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>{bookmark.summary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {status === "CanLoadMore" && (
              <div className="flex justify-center">
                <Button
                  onClick={() => loadMore(5)}
                  variant="outline"
                  className="mt-2"
                >
                  Load more
                </Button>
              </div>
            )}
          </div>

          <div className="hidden text-sm lg:flex flex-col items-center">
            {bookmarks.length > 0 && (
              <Calendar
                mode="single"
                defaultMonth={date}
                selected={date}
                captionLayout={dropdown}
                onSelect={setDate}
                className="rounded-lg border border-input shadow-sm bg-background dark:bg-card transition-colors"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const EventsView = ({ twitterUsername }: EventsViewProps) => {
  const [dropdown, _] = useState<CaptionLayout>("dropdown");
  const [date, setDate] = useState<Date | undefined>(new Date());

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
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-start gap-4 group bg-background dark:bg-card/40 
                   rounded-md p-1.5 h-16 font-sans border border-transparent 
                   hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="size-8 text-sm pl-2 pt-0.5">
                  <CalendarClock className="size-5" strokeWidth={1.02} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-1.5 cursor-pointer text-sm">
                        {event.label}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>{event.description.slice(0, 40)}...</span>
                      </div>
                    </div>
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
