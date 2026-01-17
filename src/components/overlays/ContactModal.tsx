/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { FacebookButton, InstagramButton, WhatsappButton } from "@/components";

interface ContactModalProps {
  trigger?: React.ReactNode;
}

const contactMethods = [
  {
    name: "WhatsApp",
    component: <WhatsappButton />,
    description: "Chateá con nosotros",
    action: "https://wa.me/+5491131738925",
    color: "#25D366",
  },
  // {
  //   name: "Facebook",
  //   component: <FacebookButton />,
  //   description: "Seguinos en Facebook",
  //   action: "https://www.facebook.com",
  //   color: "#1877F2",
  // },
  // {
  //   name: "Instagram",
  //   component: <InstagramButton />,
  //   description: "Mirá nuestras novedades",
  //   action: "https://www.instagram.com",
  //   color: "#BB33A0",
  // },
  {
    name: "Email",
    icon: "/icons/gmail.svg",
    description: "Escribinos un correo",
    action: "mailto:matileonardo.2013@gmail.com",
    color: "#EA4335",
  },
];

export const ContactModal = ({ trigger }: ContactModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="text-sm font-medium hover:text-gray-200 cursor-pointer"
          >
            Contacto
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="w-11/12 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Contactanos</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-3 mb-6">
          {contactMethods.map((contact, index) => (
            <a
              key={index}
              href={contact.action}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: contact.color }}
            >
              <div className="w-8 h-8 center-flex">
                {contact.component ?? <img src={contact.icon} alt="Ícono" width={20} height={20} />}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-subheading text-gray-900">
                  {contact.name}
                </h3>
                <p className="text-xs text-gray-600">{contact.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-sm text-gray-600">
              Respondemos rápido por WhatsApp
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm text-gray-600">
              Seguinos para ver las últimas ofertas
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

