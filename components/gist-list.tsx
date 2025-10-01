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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Tag, TagInput } from "emblor";
import { CalendarClock } from "lucide-react";
import { useState } from "react";

type GistsViewProps = {
  twitterUsername: string;
};

export const GistsView = ({ twitterUsername }: GistsViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [emailTags, setEmailTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const newGists = useMutation(api.event.newGist);

  const {
    results: gists,
    isLoading,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.event.listGists,
    twitterUsername
      ? {
          twitterId: twitterUsername,
          date: date?.toISOString() ?? new Date().toISOString(),
        }
      : "skip",
    { initialNumItems: 5 }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const label = form.get("label") as string;
    const description = form.get("description") as string;

    await newGists({
      label,
      description,
      twitterId: twitterUsername,
      email_blast: emailTags.map((item) => item.text),
    });

    setEmailTags([] as Tag[]);
    setOpen(false);
  };

  return (
    <div className="flex-1 p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-sans text-foreground">Gists:</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm hover:shadow-md" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              New Gist
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create a new Gist</DialogTitle>
              <DialogDescription>
                Add a label, description, and optionally emails of users to
                notify.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input id="label" name="label" placeholder="Frontend Friday" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="eg Best hackathon ever."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emails">Notify Emails</Label>
                <TagInput
                  id={"emails"}
                  tags={emailTags}
                  setTags={(newTags) => setEmailTags(newTags)}
                  placeholder="Add a tag"
                  styleClasses={{
                    inlineTagsContainer:
                      "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                    input: "w-full min-w-[80px] shadow-none px-2 h-7",
                    tag: {
                      body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                      closeButton:
                        "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                    },
                  }}
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                />
              </div>

              <Button className="w-full mt-4" type="submit">
                Create Gist
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            ))}

          {!isLoading && gists.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 p-12 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10 text-center">
              <div className="rounded-full bg-muted/50 p-4">
                <CalendarClock
                  className="size-8 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">
                  No gists created yet
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Create your first gist to organize events and notify your team
                  members.
                </p>
              </div>
              <Button onClick={() => setOpen(true)} size="sm" className="mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
                Create Your First Gist
              </Button>
            </div>
          )}

          {gists.map((event) => (
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
                    <p className="text-xs text-muted-foreground">
                      {event.description.slice(0, 40)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

        <div className="hidden w-80x text-sm lg:flex flex-col items-center">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            captionLayout={"dropdown"}
            onSelect={setDate}
            className="rounded-lg border border-input shadow-sm bg-background dark:bg-card transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
