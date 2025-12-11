"use client";

import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "../ui";
import { signOut } from "@/libs/auth-client";

export const LogOutButton = () => {
  function onClick() {
    signOut();
    redirect('/');
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="border border-black bg-black text-white"
    >
      <LogOut size={18} color="#fff" />
      Cerrar sesión
    </Button>
  );
};
