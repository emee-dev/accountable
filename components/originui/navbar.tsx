import {
  ChevronRight,
  ChevronsUpDown,
  Hash,
  Search,
  SearchIcon,
  SquareTerminal,
  WandSparkles,
} from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import Logo from "@/components/logo";
import NotificationMenu from "@/components/notification-menu";
import UserMenu from "@/components/user-menu";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggler } from "../magicui/theme-toggler";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Navbar() {
  const [isDialogOpen, setDialogOpen] = useState(false);
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
              <BreadcrumbItem className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:text-foreground">
                    <BreadcrumbEllipsis />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Select defaultValue="1">
                  <SelectPrimitive.SelectTrigger
                    aria-label="Select project"
                    asChild
                  >
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
                    <SelectItem value="1">Twitter</SelectItem>
                    <SelectItem value="2">Events</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grow">
          <DocSearch />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggler />
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export const DocSearch = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const BreadCrumbs = (props: { filePath: string }) => {
    // Breaks a URI into individual parts separated by a forward slash
    const tokens = props.filePath.match(/\/|{[^}]+}|[^/]+/g) ?? [];

    return (
      <div className="flex items-center min-w-0 flex-1">
        {tokens.map((item, index) => {
          const key = `${item}-${index}`;

          if (item === "/") {
            const stripped = item.replace("/", "");
            return (
              <div key={key} className="flex items-center min-w-0 flex-shrink">
                <ChevronRight className="mx-0.5 flex-shrink-0 size-3 text-gray-500 dark:text-gray-400" />
                <div className="[&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light text-xs text-gray-500 dark:text-gray-400 truncate">
                  {stripped}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="flex items-center flex-shrink-0">
              <div className="truncate [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light text-xs text-gray-500 dark:text-gray-400 w-fit">
                {item}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
            <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
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
        <DialogContent className="max-w-[22rem] md:max-w-2xl translate-y-1 top-10 p-1.5 gap-0 bg-accent border-none rounded-2xl sm:rounded-2xl">
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
            {query && (
              <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded border">
                ESC
              </kbd>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto mt-3">
            <div className="last:mb-2 group" role="option" tabIndex={-1}>
              <div className="cursor-pointer relative rounded-xl flex gap-3 px-2.5 py-2 items-center">
                <Hash className="text-gray-500 dark:text-gray-400 h-4 w-4 shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex gap-1 items-center">
                    <BreadCrumbs filePath="Using the REST API/Pagination" />
                  </div>
                  <div className="flex gap-1 items-center text-gray-800 dark:text-gray-200">
                    <div className="truncate text-sm leading-[18px] text-gray-800 dark:text-gray-200 [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light font-medium">
                      Pagination
                    </div>
                  </div>
                  <p className="text-xs truncate w-full text-gray-500 [&_mark]:text-gray-500 [&_mark]:bg-transparent [&_mark_b]:font-normal [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_b_mark]:font-normal [&amp;_b_mark]:text-primary dark:[&amp;_b_mark]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light">
                    Pagination When the API res
                  </p>
                </div>
                <ChevronRight className="text-transparent group-hover:text-primary h-4 w-4" />
              </div>
            </div>

            {/* Methods */}
            <div className="last:mb-2 group" role="option" tabIndex={-1}>
              <div className="cursor-pointer relative rounded-xl flex gap-3 px-2.5 py-2 items-center">
                <SquareTerminal className="h-4 w-4 shrink-0 text-primary dark:text-primary-light" />
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex gap-1 items-center">
                    <BreadCrumbs filePath="Endpoints/Endpoints/teams/Invite a user" />
                  </div>
                  <div className="flex gap-1 items-center text-gray-800 dark:text-gray-200">
                    <div className="method-pill font-bold bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-400 text-xs font-mono rounded px-1 py-0">
                      POST
                    </div>
                    <div className="truncate text-sm leading-[18px] text-gray-800 dark:text-gray-200 [&_mark]:bg-transparent [&_mark_b]:font-medium [&_mark_b]:text-md [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light font-medium">
                      Invite a user
                    </div>
                  </div>
                  <p className="text-xs truncate w-full text-gray-500 [&_mark]:text-gray-500 [&_mark]:bg-transparent [&_mark_b]:font-normal [&_mark_b]:text-primary dark:[&_mark_b]:text-primary-light [&amp;_b_mark]:font-normal [&amp;_b_mark]:text-primary dark:[&amp;_b_mark]:text-primary-light [&amp;_span.font-medium]:text-primary dark:[&amp;_span.font-medium]:text-primary-light">
                    to join the team specified in the URL. The{" "}
                  </p>
                </div>
                <ChevronRight className="text-transparent group-hover:text-primary h-4 w-4" />
              </div>
            </div>

            {/* Ask AI */}
            <div className="px-2.5 py-2 text-gray-500 text-sm truncate w-full">
              Ask AI assistant
            </div>
            <div className="last:mb-2" role="option" tabIndex={-1}>
              <div className="flex items-center gap-2 px-2.5 py-2 w-full cursor-pointer rounded-xl bg-[#F7F7F8] dark:bg-white/5">
                <WandSparkles className="text-primary dark:text-primary-dark h-4 w-4 shrink-0" />
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                  Can you tell me about "{query}"?
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
