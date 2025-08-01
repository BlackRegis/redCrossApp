"use client"

import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's 'md' breakpoint is 768px
    }

    checkIfMobile() // Check on initial render

    window.addEventListener("resize", checkIfMobile) // Add event listener for resize

    return () => {
      window.removeEventListener("resize", checkIfMobile) // Clean up on unmount
    }
  }, [])

  return isMobile
}
