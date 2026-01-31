import { Gift, Check, Ticket } from "lucide-react";

const BenefitsLegend = () => {
  return (
    <div className="max-w-content mx-auto bg-whtie rounded-xl border-2 border-border p-4 sm:p-6 shadow-sm">
      <h3 className="font-subheading text-lg mb-4 text-center">Beneficios por orden de compra</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tier Oro */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-discount-gold/10 border border-discount-gold">
          <div className="bg-discount-gold rounded-full p-2 shrink-0">
            <Gift className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <p className="font-subheading text-discount-gold">Compras #1 - #5</p>
            <p className="text-sm text-foreground">
              <span className="font-subheading text-lg">15%</span> de reintegro
            </p>
          </div>
        </div>

        {/* Tier Plata */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary">
          <div className="bg-primary rounded-full p-2 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="font-subheading text-primary">Compras #6 - #10</p>
            <p className="text-sm text-foreground">
              <span className="font-subheading text-lg">10%</span> de reintegro
            </p>
          </div>
        </div>

        {/* Tier Bronce */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-discount-bronze/10 border border-discount-bronze">
          <div className="bg-discount-bronze rounded-full p-2 shrink-0">
            <Gift className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <p className="font-subheading text-discount-bronze">Compras #11 - #20</p>
            <p className="text-sm text-foreground">
              <span className="font-subheading text-lg">5%</span> de reintegro
            </p>
          </div>
        </div>
      </div>

      {/* Leyenda de estados */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded bg-muted border border-muted-foreground/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-success" />
          </div>
          <span>Comprado</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded bg-card border-2 border-border flex items-center justify-center">
            <span className="text-xs font-subheading">N</span>
          </div>
          <span className="text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Ticket className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">Todos participan del sorteo</span>
        </div>
      </div>
    </div>
  );
};

export default BenefitsLegend;