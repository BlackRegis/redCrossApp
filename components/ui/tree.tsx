"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface TreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  level?: number
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
})
Tree.displayName = "Tree"

const TreeNode = React.forwardRef<HTMLDivElement, TreeNodeProps>(
  ({ className, children, level = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
          className,
        )}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TreeNode.displayName = "TreeNode"

export { Tree, TreeNode }
