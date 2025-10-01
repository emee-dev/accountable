"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export const ThemeToggler = ({ className }: Props) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = isDark ? "light" : "dark";

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
        setIsDark(newTheme === "dark");
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, setTheme]);

  return (
    <Button
      ref={buttonRef}
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      className={cn(
        "text-muted-foreground relative size-8 rounded-full shadow-none",
        className
      )}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
};
