"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Tree = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col", className)} ref={ref} {...props} />
))
Tree.displayName = "Tree"

const TreeItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("relative flex items-center", className)} ref={ref} {...props} />
  ),
)
TreeItem.displayName = "TreeItem"

const TreeItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex-1 text-sm font-medium", className)} ref={ref} {...props} />
  ),
)
TreeItemContent.displayName = "TreeItemContent"

const TreeItemToggle = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button
      className={cn(
        "w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground shrink-0",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
TreeItemToggle.displayName = "TreeItemToggle"

export { Tree, TreeItem, TreeItemContent, TreeItemToggle }
