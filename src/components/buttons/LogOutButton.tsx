"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui";
import { signOut } from "@/libs/auth-client";

export const LogOutButton = () => {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut()}
      className="border border-black bg-black text-white"
    >
      <LogOut size={18} color="#fff" />
      Cerrar sesión
    </Button>
  );
};
