/* eslint-disable @next/next/no-img-element */
'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "../ui";
import { cn } from "@/libs/utils";

interface AdminReturnButtonProps {
  size?: number;
}

export const AdminReturnButton = ({ size = 20 }: AdminReturnButtonProps) => {
  const router = useRouter();    

  return (
    <Button 
      onClick={() => router.back()}
      variant="ghost"
      className="w-8 h-8 center-flex border-2 border-black rounded-lg hover:bg-background-hover "
    >
        <ArrowLeft className="" size={size} />
    </Button>
  )
}

interface AdminSidebarLinkProps {
  to: string;
  onClick: () => void;
  className?: string;
  src: string;
  alt: string;
  size: number;
  span?: string;
}

export const AdminSidebarLink = ({ to, onClick, className, src, alt, size, span }: AdminSidebarLinkProps) => {
  const path = usePathname();

  const isActive = path === to;

  return (
    <Link 
      href={to} 
      onClick={onClick} 
      className={cn(
        className,
        "px-3 py-2 flex items-center gap-3 whitespace-nowrap rounded-lg font-medium group",
        isActive && " bg-primary/10 outline outline-primary",
        !isActive && "text-gray-700 hover:outline hover:outline-primary hover:bg-primary/10"
      )}
    >
      <img 
        src={src} 
        alt={alt} 
        width={size} 
        height={size} 
      />
      {span && <span className="text-sm">{span}</span>}
    </Link>
  )
}