"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchEntry } from "@convex-dev/rag";
import { useAction } from "convex/react";
import {
  ChevronRight,
  Loader2,
  Search,
  SearchIcon,
  SquareTerminal,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

type Entry = {
  entryId: string;
  filterValues: [];
  importance: number;
  metadata: {
    eventId: string;
    eventType: string;
  };
  status: string;
  text: string;
};

type Results = {
  answer: string | undefined;
  entries: Entry[];
};

export const DocSearch = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const aiRagSearch = useAction(api.rag.ragSearch);
  const askAiQuestion = useAction(api.rag.askQuestion);

  const debouncedQuery = useDebounce(query, 500);

  const [results, setResults] = useState<Results | null>(null);

  async function ragSearchLoader(query: string) {
    setLoading(true);
    try {
      console.log("Calling...", query);
      const result = await aiRagSearch({
        eventType: "twitter_bookmark",
        query,
      });

      console.log("Rag search", result);
      setResults(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function askAiQuestionLoader(prompt: string) {
    setLoading(true);
    try {
      const result = await askAiQuestion({
        eventType: "twitter_bookmark",
        prompt,
      });

      console.log("Ai answer: ", result);

      setResults(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(null);
      return;
    }

    ragSearchLoader(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <>
      {!isMobile && (
        <div
          className="relative mx-auto w-full max-w-xs cursor-pointer"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <div className="peer ps-8 pe-10 text-muted-foreground border-input min-w-0 rounded-md border bg-transparent px-3 h-9 shadow-xs text-sm flex items-center">
            Search...
          </div>
          <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 pointer-events-none">
            <SearchIcon size={16} />
          </div>
          <div className="absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground pointer-events-none">
            <kbd className="inline-flex h-5 max-h-full items-center rounded border px-1 text-[0.625rem] font-medium text-muted-foreground/70">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {isMobile && (
        <Button
          onClick={() => setSearchOpen(!searchOpen)}
          size="icon"
          variant="outline"
        >
          <Search className="size-4" />
        </Button>
      )}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-[29rem] md:max-w-2xl translate-y-1 top-10 p-1.5 gap-0 bg-accent border-none rounded-2xl flex flex-col h-[32rem]">
          <DialogHeader className="sr-only">
            <DialogTitle>Document search</DialogTitle>
            <DialogDescription>
              Search for relevant documents.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center py-1 px-3 gap-x-2 border border-black rounded-xl">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              value={query}
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-input/0"
            />
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            )}
            {query && !results?.answer && !loading && (
              <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded border">
                ESC
              </kbd>
            )}
            {query && results?.answer && (
              <kbd
                className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded border cursor-pointer"
                onClick={() => setResults(null)}
              >
                CLR
              </kbd>
            )}
          </div>

          <div className="flex-1 overflow-y-auto mt-3">
            {!results?.answer && (
              <>
                {loading && (
                  <div className="space-y-2 px-2.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                )}
                {!loading &&
                  results &&
                  results.entries.map((item) => (
                    <ResultItem key={item.entryId} text={item.text} />
                  ))}
              </>
            )}

            {results && results.answer && (
              <div className="space-y-4 px-2.5 py-2">
                <div className="bg-white dark:bg-white/5 rounded-xl p-3 shadow">
                  <h4 className="text-sm font-semibold text-primary">
                    AI Answer
                  </h4>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                    {results.answer}
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-medium text-gray-500 mb-2">
                    Supporting results
                  </h5>
                  <div className="space-y-2">
                    {results.entries.map((entry) => (
                      <ResultItem key={entry.entryId} text={entry.text} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <div className="px-2.5 py-2 text-gray-500 text-sm truncate w-full">
              Ask AI assistant
            </div>
            <div
              className="flex items-center gap-2 px-2.5 py-2 w-full cursor-pointer rounded-xl bg-[#F7F7F8] dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition"
              onClick={async () => {
                if (!debouncedQuery) return;
                askAiQuestionLoader(debouncedQuery);
              }}
            >
              <WandSparkles className="text-primary dark:text-primary-dark h-4 w-4 shrink-0" />
              <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                Can you tell me about "{query}"?
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ResultItem = ({ text }: { text: string }) => (
  <div className="cursor-pointer relative rounded-xl flex gap-3 px-2.5 py-2 items-center hover:bg-gray-50 dark:hover:bg-white/5">
    <SquareTerminal className="h-4 w-4 shrink-0 text-primary dark:text-primary-light" />
    <div className="flex flex-col flex-1 min-w-0 gap-1">
      <div className="truncate text-sm leading-[18px] text-gray-800 dark:text-gray-200">
        {text.slice(0, 40)}...
      </div>
      <p className="text-xs truncate w-full text-gray-500">
        {text.slice(40, 140)}...
      </p>
    </div>
    <ChevronRight className="text-gray-400 group-hover:text-primary h-4 w-4" />
  </div>
);
