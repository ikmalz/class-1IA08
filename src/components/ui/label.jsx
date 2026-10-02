import { cn } from "cn"

function Label({ className, htmlFor, ...props }) {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export { Label }
