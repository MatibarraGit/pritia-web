"use client";

import { useState, useEffect } from "react";

import { DEADLINE, TOTAL_DURATION, pad } from "@/utils";
import { TimeLeft } from "@/types";

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white border border-gray-100 rounded-2xl px-4 py-5 min-w-[65px] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
      <span className="font-black text-3xl leading-none tracking-tight text-gray-900 md:text-5xl">
        {pad(value)}
      </span>
      <span className="mt-2 text-[9px] font-semibold uppercase tracking-widest text-gray-400 md:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function HotSaleCountdown() {
  // Inicializamos con null pero especificamos el tipo de la interfaz
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const diff = DEADLINE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });

      const elapsed = TOTAL_DURATION - diff;
      setProgress(Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100)));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Comprobación de seguridad para el renderizado
  const isExpired = timeLeft && Object.values(timeLeft).every((v) => v === 0);

  return (
    <div 
      className="w-full mx-auto px-4 py-8 text-center font-sans bg-orange-500"
      // style={{
      //   background: "radial-gradient(circle, #f97316 50%, #ffffff 100%)"
      // }}  
    >
      {/* Badge */}
      <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
        🔥 Hot Sale — Oferta limitada
      </span>

      {/* Title */}
      <h2 className="text-2xl font-black uppercase tracking-wide text-white leading-tight mb-1">
        ¡La oferta termina en!
      </h2>
      <p className="text-sm text-white mb-6">
        Domingo 18 de mayo · 23:59:59 hs
      </p>

      {/* Clock */}
      {isExpired ? (
        <p className="text-xl font-bold text-white py-8">
          ¡El Hot Sale ha finalizado!
        </p>
      ) : timeLeft ? (
        <div className="flex items-center justify-center gap-3">
          <TimeUnit value={timeLeft.days} label="Días" />
          <TimeUnit value={timeLeft.hours} label="Horas" />
          <TimeUnit value={timeLeft.minutes} label="Minutos" />
          <TimeUnit value={timeLeft.seconds} label="Segundos" />
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-gray-300 text-sm">
          Cargando...
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-7 max-w-sm mx-auto">
        <div className="h-1.5 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white mt-2">
          <span>Inicio del sale</span>
          <span>{progress}% agotado</span>
        </div>
      </div>
    </div>
  );
}