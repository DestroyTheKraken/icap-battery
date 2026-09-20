import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex w-full flex-wrap gap-1 rounded-[var(--radius-lg)] border border-border bg-elevated/60 p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "interactive tab-active-glow group inline-flex min-h-11 flex-1 flex-col items-center justify-center rounded-[var(--radius-sm)] px-3 py-2 text-center text-sm font-medium text-muted",
        "hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/70",
        "data-[state=active]:bg-surface data-[state=active]:text-fg",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-focus/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
      {...props}
    />
  );
}
