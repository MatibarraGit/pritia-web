"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/libs/utils";
import { Gift, Check } from "lucide-react";

interface BenefitCellProps {
  number: number;
  buyerName?: string;
  isPurchased: boolean;
  openNumber: number;
  setOpenNumber: Dispatch<SetStateAction<number>>; 
}

const getDiscountInfo = (number: number): { percentage: number ; tier: string; bgColorClass: string, colorClass: string } | null => {
  if (number >= 1 && number <= 5) {
    return { percentage: 15, tier: "Oro", bgColorClass: "bg-discount-gold", colorClass: "discount-gold" };
  }
  if (number >= 6 && number <= 10) {
    return { percentage: 10, tier: "Plata", bgColorClass: "bg-primary", colorClass: "primary" };
  }
  if (number >= 11 && number <= 20) {
    return { percentage: 5, tier: "Bronce", bgColorClass: "bg-discount-bronze", colorClass: "discount-bronze" };
  }
  return null
};

const BenefitCell = ({ number, buyerName, isPurchased, openNumber, setOpenNumber }: BenefitCellProps) => {
  const discountInfo = getDiscountInfo(number);

  const cellBaseClasses = "relative flex items-center justify-center w-full aspect-square rounded-lg font-subheading text-lg transition-all duration-200 cursor-pointer border-2 bg-white";
  
  const getCellClasses = () => {
    if (isPurchased) {
      return cellBaseClasses;
    }
    
    if (discountInfo) {
      if (number <= 5) {
        return cn(cellBaseClasses, "bg-discount-gold/10 border-discount-gold hover:bg-discount-gold/20 hover:scale-105 hover:shadow-lg");
      }
      if (number <= 10) {
        return cn(cellBaseClasses, "bg-primary/10 border-primary text-foreground hover:bg-primary/20 hover:scale-105 hover:shadow-lg");
      }
      if (number <= 20) {
        return cn(cellBaseClasses, "bg-discount-bronze/10 border-discount-bronze text-foreground hover:bg-discount-bronze/20 hover:scale-105 hover:shadow-lg");
      }
    }
    
    return cn(cellBaseClasses, "bg-[#18ed18]/10 border-border text-foreground hover:border-success/50 hover:scale-105 hover:shadow-md");
  };

  const handleClick = () => {
    setOpenNumber(openNumber === number ? 0 : number);
  };

  return (
    <Tooltip open={openNumber === number}>
      <TooltipTrigger asChild >
        <div
          data-benefit-cell="true"
          className={getCellClasses()}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={`Compra número ${number}`}
        >
          <span className={cn(
            isPurchased && "line-through opacity-60 decoration-red-600"
          )}>
            {number}
          </span>
          
          {isPurchased && (
            <div className="absolute -top-1 -right-1 bg-success rounded-full p-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          
          {discountInfo && !isPurchased && (
            <div className={cn("absolute -top-1 -right-1 rounded-full p-0.5", discountInfo.bgColorClass)}>
              <Gift className="w-3 h-3 text-foreground" />
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className={cn("bg-white text-black border-2 shadow-xl p-3 max-w-xs", discountInfo?.colorClass ? `${'border'}-${discountInfo.colorClass}` : "border-success")}
      >
        <div className="space-y-1.5">
          <p className={cn("font-subheading", discountInfo?.colorClass ? `${'text'}-${discountInfo.colorClass}` : "text-success")}>
            Compra #{number}
          </p>
          
          {isPurchased && buyerName ? (
            <>
              <p className="text-sm">
                <span className="font-subheading">Comprador:</span> {buyerName}
              </p>
              {discountInfo && (
                <p className="text-sm">
                  <span className="font-subheading">Reintegro:</span>{" "}
                  <span className={cn("font-subheading", discountInfo?.colorClass && `${'text'}-${discountInfo.colorClass}`)}>{discountInfo.percentage}%</span> en su próxima compra
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success rounded-full text-xs font-medium">
                  <Gift className="w-3 h-3" />
                  Participando del sorteo
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Disponible
              </p>
              {discountInfo && (
                <p className="text-sm">
                  <span className="font-subheading">Beneficio:</span>{" "}
                  <span className={cn("font-subheading", discountInfo?.colorClass && `${'text'}-${discountInfo.colorClass}`)}>{discountInfo.percentage}%</span> de reintegro
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                + Participa del sorteo
              </p>
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default BenefitCell;