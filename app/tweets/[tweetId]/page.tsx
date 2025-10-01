"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { FileText, ImageOff, Megaphone, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

type PageProps = {
  params: Promise<{
    tweetId: string;
  }>;
  searchParams: Promise<any>;
};

type Tweet = Doc<"bookmarked_tweets"> & {
  screenshotUrl: string | null;
};

const Page = (props: PageProps) => {
  const params = use(props.params);
  const user = useQuery(api.bookmarks.getCurrentUser);
  const tweet: Tweet | undefined = useQuery(
    api.bookmarks.getBookmark,
    params.tweetId && user && user.twitterId
      ? {
          tweetId: params.tweetId,
          twitterUsername: user.twitterId,
        }
      : "skip"
  );

  if (!tweet) {
    return notFound();
  }

  if (!params?.tweetId) {
    return notFound();
  }

  if (!user || !user.twitterId) {
    return notFound();
  }

  return <ContentView tweet={tweet} user={user} />;
};

const ContentView = (props: { tweet: Tweet | undefined; user: any }) => {
  const handleDownload = async (screenshotUrl: string) => {
    try {
      const response = await fetch(screenshotUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "tweet-screenshot.png";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download screenshot", err);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 w-full lg:max-w-[70%] mx-auto md:max-w-[80%] lg:min-w-3xl">
      <Navbar user={props.user} />
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
            {props.tweet?.summary && (
              <div className="space-y-4">
                <p className="text-sm text-foreground flex items-center">
                  Summary{" "}
                  <Megaphone className="size-5 ml-3" strokeWidth={1.1} />
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed relative ps-4 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted-foreground">
                  {props.tweet.summary}
                </p>
              </div>
            )}

            {!props.tweet?.summary && (
              <div className="flex items-center gap-2 text-muted-foreground/70 text-sm rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 p-3">
                <FileText className="size-4" strokeWidth={1.2} />
                <span>No summary available</span>
              </div>
            )}

            {props.tweet?.tweet.text && (
              <div className="space-y-4">
                <p className="text-sm text-foreground">Original text: </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {props.tweet.tweet.text}
                </p>
              </div>
            )}

            {!props.tweet?.tweet.text && (
              <div className="flex items-center gap-2 text-muted-foreground/70 text-sm rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 p-3">
                <MessageSquareText className="size-4" strokeWidth={1.2} />
                <span>Tweet is not available</span>
              </div>
            )}
          </div>

          {props.tweet?.screenshotUrl && (
            <div className="max-w-sm text-sm flex flex-col items-center gap-4">
              <Image
                src={props.tweet.screenshotUrl}
                alt="Tweet screenshot"
                width={400}
                height={400}
                className="rounded-xl border border-input shadow-sm bg-background dark:bg-card transition-colors"
              />

              <div className="flex w-full gap-2">
                <Button
                  className="flex-1 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() =>
                    handleDownload(props.tweet?.screenshotUrl as string)
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          )}

          {!props.tweet?.screenshotUrl && (
            <div className="max-w-sm w-full h-[400px] flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 text-muted-foreground shadow-inner">
              <ImageOff className="size-10 mb-3 opacity-70" strokeWidth={1.2} />
              <p className="text-sm font-medium">No screenshot available</p>
              <p className="text-xs text-muted-foreground mt-1 text-center max-w-[80%]">
                This tweet could not be captured as an image. You can still read
                the summary and original text on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
