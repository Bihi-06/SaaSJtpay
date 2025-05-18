
import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// This is a simplified calendar component without radix-ui dependencies
export function Calendar() {
  return (
    <div className="p-3">
      <div className="flex justify-center py-2">
        <div className="grid grid-cols-7 gap-1">
          {/* Simplified calendar days */}
          {Array.from({ length: 31 }).map((_, i) => (
            <button
              key={i}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-9 w-9 rounded-md p-0"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
