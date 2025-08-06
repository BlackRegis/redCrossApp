import * as React from "react"
import { cn } from "@/lib/utils"

const Tree = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    indent?: number
    rowHeight?: number
    lineColor?: string
    lineWidth?: string
  }
>(
  (
    {
      className,
      indent = 24,
      rowHeight = 32,
      lineColor = "hsl(var(--border))",
      lineWidth = "1px",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={
          {
            "--tree-indent": `${indent}px`,
            "--tree-row-height": `${rowHeight}px`,
            "--tree-line-color": lineColor,
            "--tree-line-width": lineWidth,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    )
  },
)
Tree.displayName = "Tree"

const TreeItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isExpanded?: boolean
    isSelected?: boolean
    isSelectable?: boolean
    isBranch?: boolean
    isLastItem?: boolean
    level?: number
    onSelect?: () => void
  }
>(
  (
    {
      className,
      isExpanded,
      isSelected,
      isSelectable = true,
      isBranch,
      isLastItem,
      level = 0,
      onSelect,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center group",
          isSelectable && "cursor-pointer",
          !isBranch && "h-[var(--tree-row-height)]",
          className,
        )}
        style={{
          paddingLeft: `calc(var(--tree-indent) * ${level})`,
        }}
        onClick={isSelectable ? onSelect : undefined}
        {...props}
      >
        {level > 0 && (
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-[var(--tree-indent)]",
              "before:absolute before:left-[calc(var(--tree-indent)/2)] before:top-0 before:h-full before:w-[var(--tree-line-width)] before:bg-[var(--tree-line-color)]",
              isLastItem && "before:h-[calc(var(--tree-row-height)/2)]",
            )}
          />
        )}
        {level > 0 && (
          <div
            className={cn(
              "absolute left-0 top-1/2 h-[var(--tree-line-width)] w-[calc(var(--tree-indent)/2+1px)] bg-[var(--tree-line-color)]",
            )}
          />
        )}
        <div
          className={cn(
            "flex-1 flex items-center h-full",
            isSelectable && "hover:bg-accent hover:text-accent-foreground",
            isSelected && "bg-accent text-accent-foreground",
            isBranch && "h-[var(--tree-row-height)]",
          )}
        >
          {children}
        </div>
      </div>
    )
  },
)
TreeItem.displayName = "TreeItem"

const TreeBranch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isExpanded?: boolean
    level?: number
    onToggle?: () => void
  }
>(({ className, isExpanded, level = 0, onToggle, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  )
})
TreeBranch.displayName = "TreeBranch"

export { Tree, TreeItem, TreeBranch }
