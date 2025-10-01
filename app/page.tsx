"use client";

import { AuthForm } from "@/components/auth-form";
import { GistsView } from "@/components/gist-list";
import Navbar, { TwitterSetup } from "@/components/navbar";
import { TweetList } from "@/components/tweet-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { Loader2 } from "lucide-react";
import { use } from "react";

type PageProps = {
  params: Promise<any>;
  searchParams: Promise<{
    view: "twitter" | "event";
  }>;
};

type ContentProps = {
  view: string;
  twitterUsername: string;
};

export default function BookmarksPage(props: PageProps) {
  const params = use(props.searchParams);
  const user = useQuery(api.bookmarks.getCurrentUser);

  return (
    <>
      <div className="flex flex-col gap-8 p-4 w-full lg:max-w-[70%] mx-auto md:max-w-[80%] lg:min-w-3xl">
        <Navbar user={user} />

        <Authenticated>
          {!user?.twitterId && (
            <div className="w-full flex items-center justify-center p-6 pt-32">
              <Card className="max-w-md w-full shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    Connect your X (Twitter) account
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Enter your X username to enable tweet bookmarking and event
                    linking.
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <TwitterSetup user={null} />
                </CardContent>
              </Card>
            </div>
          )}

          {user && user.twitterId && (
            <Content view={params.view} twitterUsername={user.twitterId} />
          )}
        </Authenticated>

        <Unauthenticated>
          <div className="w-full max-w-sm md:max-w-3xl">
            <AuthForm />
          </div>
        </Unauthenticated>

        <AuthLoading>
          <div className="flex pt-28 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Authenticating...</p>
            </div>
          </div>
        </AuthLoading>
      </div>
    </>
  );
}

function Content({ view, twitterUsername }: ContentProps) {
  if (!view) {
    return <TweetList twitterUsername={twitterUsername} />;
  }

  if (view === "twitter") {
    return <TweetList twitterUsername={twitterUsername} />;
  }

  if (view === "event") {
    return <GistsView twitterUsername={twitterUsername} />;
  }

  return <div>No content to show</div>;
}
