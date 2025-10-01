"use client";

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
import { usePaginatedQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

type TweetListProps = {
  twitterUsername: string;
};

type CaptionLayout = React.ComponentProps<typeof Calendar>["captionLayout"];

export const TweetList = ({ twitterUsername }: TweetListProps) => {
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
          twitterId: twitterUsername,
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
            <Button variant="outline" className="ml-auto bg-transparent">
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
                  className="flex items-start gap-4 rounded-md p-3 border border-border/40 shadow-sm bg-card/40 animate-pulse"
                >
                  <Skeleton className="size-8 rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
              ))}

            {!isLoading && bookmarks.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 p-12 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10 text-center">
                <div className="rounded-full bg-muted/50 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-foreground">
                    No bookmarks yet
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Start bookmarking tweets to save them for later. They'll
                    appear here organized by date.
                  </p>
                </div>
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
