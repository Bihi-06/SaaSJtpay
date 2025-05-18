
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined);

export const Collapsible = ({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  children,
  className,
  ...props
}: CollapsibleProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const onOpenChange = setControlledOpen || setUncontrolledOpen;

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);

    if (!context) {
      throw new Error("CollapsibleTrigger must be used within a Collapsible");
    }

    const { open, onOpenChange } = context;

    return (
      <button
        ref={ref}
        className={className}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);

    if (!context) {
      throw new Error("CollapsibleContent must be used within a Collapsible");
    }

    const { open } = context;

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";
