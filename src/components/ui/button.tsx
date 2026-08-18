import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-none border-2 border-[var(--border)] font-bold uppercase tracking-wider text-[var(--primary-foreground)] transition-all duration-75 outline-none select-none cursor-pointer shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
        primary: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
        red: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
        white: "bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--card-foreground)]",
        black: "bg-[var(--secondary)] hover:bg-neutral-900 text-[var(--secondary-foreground)]",
        outline: "bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--card-foreground)] border-2 border-[var(--border)]",
        ghost: "border-transparent shadow-none bg-transparent hover:bg-black/10 text-[var(--foreground)] hover:translate-x-0 hover:translate-y-0",
        destructive: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
      },
      size: {
        default: "h-10 gap-2 px-5 py-2 text-xs sm:text-sm",
        xs: "h-7 gap-1 px-2.5 py-1 text-xs",
        sm: "h-8 gap-1.5 px-3.5 py-1.5 text-xs",
        lg: "h-11 gap-2.5 px-6 py-3 text-sm",
        xl: "h-13 gap-3 px-8 py-3.5 text-base",
        icon: "size-9 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
