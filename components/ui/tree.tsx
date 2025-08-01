import * as React from "react"
import { cn } from "@/lib/utils"

const Tree = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1", className)} {...props} />
))
Tree.displayName = "Tree"

const TreeItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
        className,
      )}
      {...props}
    />
  ),
)
TreeItem.displayName = "TreeItem"

const TreeItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1", className)} {...props} />,
)
TreeItemContent.displayName = "TreeItemContent"

const TreeItemToggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700",
        className,
      )}
      {...props}
    />
  ),
)
TreeItemToggle.displayName = "TreeItemToggle"

export { Tree, TreeItem, TreeItemContent, TreeItemToggle }
