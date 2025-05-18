
import React, { useState, useContext, createContext } from "react";
import { cn } from "@/lib/utils";

type TooltipContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  delayDuration?: number;
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

// This provider allows tooltips to share configuration
export function TooltipProvider({
  children,
  delayDuration = 300,
}: {
  children: React.ReactNode;
  delayDuration?: number;
}) {
  const [open, setOpen] = useState(false);
  
  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, _ref) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("TooltipTrigger must be used within a TooltipProvider");
  
  const { setOpen, delayDuration } = context;
  
  let timer: ReturnType<typeof setTimeout>;
  
  const handleMouseEnter = () => {
    timer = setTimeout(() => setOpen(true), delayDuration);
  };
  
  const handleMouseLeave = () => {
    clearTimeout(timer);
    setOpen(false);
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }
  
  return (
    <span
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("TooltipContent must be used within a TooltipProvider");
  
  const { open } = context;
  
  if (!open) return null;
  
  return (
    <div 
      ref={ref}
      role="tooltip"
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";
