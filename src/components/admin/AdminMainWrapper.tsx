"use client";

import { type ReactNode } from "react";
import { cn } from "@/libs/utils";
import { adminSidebarContext } from "@/contexts";

interface AdminMainWrapperProps {
  children: ReactNode;
}

export const AdminMainWrapper = ({ children }: AdminMainWrapperProps) => {
  const { sidebarDesktop } = adminSidebarContext();

  return (
    <main className={cn(
      "w-full min-h-content p-4 md:p-6 mt-18 mx-auto transition-all duration-300",
      sidebarDesktop ? "md:w-[calc(100%-16rem)] md:ml-64" : "md:w-full md:ml-0"
    )}>
      <div className="max-w-full">
        {children}
      </div>
    </main>
  );
};

