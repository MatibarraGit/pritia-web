"use client";

import { useTransition } from "react";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/libs/auth-client";

import { Button } from "../ui";
import { MyLoader } from "@/components";

export const LogOutButton = () => {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await signOut();
      redirect('/');
    })
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="bg-black text-white hover:bg-black/85 relative"
      disabled={isPending}
    >
      {isPending && (
        <MyLoader className="w-full center-flex absolute bg-black/85" />
      )}
      <LogOut size={18} color="#fff" />
      <span>Cerrar sesión</span>
    </Button>
  );
};
