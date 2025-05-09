
import * as React from "react"
import { cn } from "@/lib/utils"

const RefractionInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "number", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-base text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
RefractionInput.displayName = "RefractionInput"

export { RefractionInput }
