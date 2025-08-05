"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const goToFirstPage = () => {
    if (hasPreviousPage) {
      onPageChange(1)
    }
  }

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1)
    }
  }

  const goToLastPage = () => {
    if (hasNextPage) {
      onPageChange(totalPages)
    }
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
          onClick={goToFirstPage}
          disabled={!hasPreviousPage}
        >
          <span className="sr-only">Aller à la première page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 bg-transparent"
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
        >
          <span className="sr-only">Aller à la page précédente</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="h-8 w-8 p-0 bg-transparent" onClick={goToNextPage} disabled={!hasNextPage}>
          <span className="sr-only">Aller à la page suivante</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
          onClick={goToLastPage}
          disabled={!hasNextPage}
        >
          <span className="sr-only">Aller à la dernière page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

type PaginationContentProps = React.HTMLAttributes<HTMLDivElement>

const PaginationContent = React.forwardRef<HTMLDivElement, PaginationContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex w-full items-center justify-center sm:justify-between", className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"

type PaginationLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isActive?: boolean
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground",
          isActive && "bg-secondary text-secondary-foreground",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationLink.displayName = "PaginationLink"

type PaginationItemProps = React.HTMLAttributes<HTMLDivElement>

const PaginationItem = React.forwardRef<HTMLDivElement, PaginationItemProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationNext = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, ...props }, ref) => {
    return (
      <Button ref={ref} variant="outline" className={cn("h-8 w-8 p-0", className)} {...props}>
        <span className="sr-only">Aller à la page suivante</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    )
  },
)
PaginationNext.displayName = "PaginationNext"

const PaginationPrevious = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button ref={ref} variant="outline" className={cn("h-8 w-8 p-0", className)} {...props}>
      <span className="sr-only">Aller à la page précédente</span>
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
})
PaginationPrevious.displayName = "PaginationPrevious"

export { Pagination, PaginationContent, PaginationLink, PaginationItem, PaginationNext, PaginationPrevious }
