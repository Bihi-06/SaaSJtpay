
import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// Export a buttonVariants function for other components that need it
export const buttonVariants = (props: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) => {
  const { variant = "default", size = "default", className = "" } = props;

  // Base classes
  let variantClasses = "";
  let sizeClasses = "";
  
  // Variant styling
  switch (variant) {
    case "default":
      variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
      break;
    case "destructive":
      variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      break;
    case "outline":
      variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
      break;
    case "secondary":
      variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      break;
    case "ghost":
      variantClasses = "hover:bg-accent hover:text-accent-foreground";
      break;
    case "link":
      variantClasses = "text-primary underline-offset-4 hover:underline";
      break;
  }
  
  // Size styling
  switch (size) {
    case "default":
      sizeClasses = "h-10 px-4 py-2";
      break;
    case "sm":
      sizeClasses = "h-9 rounded-md px-3";
      break;
    case "lg":
      sizeClasses = "h-11 rounded-md px-8";
      break;
    case "icon":
      sizeClasses = "h-10 w-10";
      break;
  }
  
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
  
  return `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
