
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
  children: React.ReactNode;
}

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

export const Popover = ({ children }: PopoverProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  
  if (!context) {
    throw new Error("PopoverTrigger must be used within a Popover");
  }
  
  const { open, setOpen } = context;
  
  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </div>
  );
});

PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  const contentRef = useRef<HTMLDivElement>(null);
  
  if (!context) {
    throw new Error("PopoverContent must be used within a Popover");
  }
  
  const { open, setOpen } = context;
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contentRef.current && 
        !contentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, setOpen]);
  
  if (!open) return null;
  
  return (
    <div
      ref={(node) => {
        // Merge refs
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        contentRef.current = node;
      }}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 absolute top-full mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

PopoverContent.displayName = "PopoverContent";
