import * as React from "react";
import Link, { LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover text-white",
        secondary:
        "bg-secondary text-white shadow-xs hover:bg-secondary-hover",
        outline:
          "border bg-background border-primary text-primary shadow-xs hover:bg-outline-hover hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 bg-gray-100 center-flex active:scale-95",
        destructive:
          "border-1 border-danger text-danger/90 shadow-xs hover:bg-danger/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 rounded-md gap-1.5 px-2 has-[>svg]:px-1.5",
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface BaseButtonProps {
  className?: string;
  children?: React.ReactNode;
}

// Discriminated union for button vs link
type ButtonAsButton = BaseButtonProps &
  VariantProps<typeof buttonVariants> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'href'> & {
    href?: undefined;
  };

type ButtonAsLink = BaseButtonProps &
  VariantProps<typeof buttonVariants> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    href: LinkProps['href'];
  } & Pick<LinkProps, 'href' | 'prefetch' | 'replace' | 'scroll' | 'shallow' | 'locale'>;

type ButtonProps = ButtonAsButton | ButtonAsLink;

function Button({ href, className, variant, size, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (href && href !== "" && !props.onClick) {
    const { children, ...linkProps } = props as ButtonAsLink;
    return (
      <Link {...linkProps} href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { children, ...buttonProps } = props as ButtonAsButton;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
