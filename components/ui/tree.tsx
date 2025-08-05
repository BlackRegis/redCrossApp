"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props}>
    {children}
  </div>
))
Tree.displayName = "Tree"

interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  level?: number
  isExpanded?: boolean
  onToggle?: () => void
  icon?: React.ReactNode
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  ({ className, children, level = 0, isExpanded, onToggle, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      onClick={onToggle}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </div>
  ),
)
TreeItem.displayName = "TreeItem"

interface TreeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  isExpanded?: boolean
}

const TreeGroup = React.forwardRef<HTMLDivElement, TreeGroupProps>(
  ({ className, children, isExpanded = true, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props}>
      {isExpanded && children}
    </div>
  ),
)
TreeGroup.displayName = "TreeGroup"

export { Tree, TreeItem, TreeGroup }
