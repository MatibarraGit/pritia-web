"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SchedulesModalProps {
  trigger?: React.ReactNode;
}

export const SchedulesModal = ({ trigger }: SchedulesModalProps) => {
  const [open, setOpen] = useState(false);

  const scheduleData = [
    { day: "Lunes", hours: "09:00 - 18:00", isOpen: true },
    { day: "Martes", hours: "09:00 - 18:00", isOpen: true },
    { day: "Miércoles", hours: "09:00 - 18:00", isOpen: true },
    { day: "Jueves", hours: "09:00 - 18:00", isOpen: true },
    { day: "Viernes", hours: "09:00 - 18:00", isOpen: true },
    { day: "Sábado", hours: "09:00 - 18:00", isOpen: true },
    { day: "Domingo", hours: "Cerrado", isOpen: false },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="text-sm font-medium hover:text-gray-200 cursor-pointer"
          >
            Horarios
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <DialogTitle>Horarios de Atención</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-2 mb-6">
          {scheduleData.map((schedule) => (
            <div
              key={schedule.day}
              className={`flex items-center justify-between p-3 rounded-md ${
                schedule.isOpen
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {schedule.day}
              </span>
              <span
                className={`text-sm font-medium ${
                  schedule.isOpen ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span className="text-sm text-gray-600">
              Lunes a Sábado de 09:00 a 18:00hs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-600">
              Domingos permanece cerrado
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

