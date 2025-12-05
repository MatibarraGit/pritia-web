"use client";

import { useTransition, useRef, FormEvent } from "react";
import { toastContext } from "@/contexts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const EmailForm = () => {
  const { showToast } = toastContext();
  const [isPending, startTransition] = useTransition();
  const emailInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    startTransition(async () => {
      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          showToast(data.message || "¡Gracias por registrarte!", "success");
          if (emailInputRef.current) {
            emailInputRef.current.value = "";
          }
        } else {
          showToast(data.message || "Error al procesar la solicitud", "danger");
        }
      } catch {
        showToast("Error al procesar la solicitud", "danger");
      }
    });
  }

  return (
    <form
      className="flex w-full md:w-1/2"
      onSubmit={handleSubmit}
    >
      <Input
        ref={emailInputRef}
        name="email"
        id="email"
        type="email"
        placeholder="Ingresá tu E-mail"
        className="rounded-l-md rounded-r-none bg-gray-100/50 border-none focus-visible:ring-2 focus-visible:ring-primary"
        required
      />
      <Button
        type="submit"
        variant="secondary"
        size="default"
        className="rounded-l-none rounded-r-md h-9 px-4"
        disabled={isPending}
      >
        {isPending ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};

