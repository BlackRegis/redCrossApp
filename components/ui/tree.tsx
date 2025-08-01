"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Tree = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    initialSizing?: boolean
  }
>(({ className, initialSizing = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1",
      initialSizing && "[&_.is-collapsible]:!h-auto [&_.is-collapsible]:!opacity-100",
      className,
    )}
    {...props}
  />
))
Tree.displayName = "Tree"

const TreeItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isSelectable?: boolean
    isExpanded?: boolean
    isSelected?: boolean
    isCollapsible?: boolean
    isLastItem?: boolean
    level?: number
  }
>(({ className, isSelectable, isExpanded, isSelected, isCollapsible, isLastItem, level = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center rounded-md pr-2",
      isSelectable && "cursor-pointer hover:bg-muted",
      isSelected && "bg-accent",
      className,
    )}
    data-state-selected={isSelected}
    data-state-expanded={isExpanded}
    data-state-collapsible={isCollapsible}
    data-state-last-item={isLastItem}
    data-level={level}
    {...props}
  />
))
TreeItem.displayName = "TreeItem"

const TreeItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 items-center py-2", className)} {...props} />
  ),
)
TreeItemContent.displayName = "TreeItemContent"

const TreeItemIndicator = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<typeof ChevronRight>>(
  ({ className, ...props }, ref) => (
    <ChevronRight
      ref={ref}
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        "group-data-[state-expanded=true]:rotate-90",
        className,
      )}
      {...props}
    />
  ),
)
TreeItemIndicator.displayName = "TreeItemIndicator"

const TreeItemChevron = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute left-0 flex h-full w-8 items-center justify-center", className)}
      {...props}
    />
  ),
)
TreeItemChevron.displayName = "TreeItemChevron"

const TreeItemArrow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute left-4 h-full w-px bg-muted-foreground",
        "group-data-[state-last-item=true]:hidden",
        className,
      )}
      {...props}
    />
  ),
)
TreeItemArrow.displayName = "TreeItemArrow"

const TreeItemArrowLine = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute left-4 top-1/2 h-px w-4 bg-muted-foreground", className)} {...props} />
  ),
)
TreeItemArrowLine.displayName = "TreeItemArrowLine"

const TreeItemChildren = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    level?: number
  }
>(({ className, level = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex flex-col",
      "h-0 overflow-hidden opacity-0 transition-all duration-200",
      "group-data-[state-expanded=true]:h-auto group-data-[state-expanded=true]:opacity-100",
      className,
    )}
    data-level={level}
    {...props}
  />
))
TreeItemChildren.displayName = "TreeItemChildren"

const TreeTrigger = CollapsiblePrimitive.Trigger

const TreeCollapsible = CollapsiblePrimitive.Root

export {
  Tree,
  TreeItem,
  TreeItemContent,
  TreeItemIndicator,
  TreeItemChevron,
  TreeItemArrow,
  TreeItemArrowLine,
  TreeItemChildren,
  TreeTrigger,
  TreeCollapsible,
}
