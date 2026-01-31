import { FileText, Gift, Sparkles, Trophy } from "lucide-react";
import BenefitsGrid from "@/components/benefits-page/BenefitsGrid";
import BenefitsLegend from "@/components/benefits-page/BenefitsLegend";

const Benefits = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="px-4 py-1.5 mb-4 inline-flex items-center gap-2 bg-secondary text-black rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              ¡PROMOCIÓN EXCLUSIVA!
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              Beneficios para los primeros 50 compradores
            </h1>
            
            <p className="text-lg sm:text-xl opacity-90 mb-6">
              ¡Sé parte de nuestros primeros clientes y obtené beneficios increíbles!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                <Gift className="w-5 h-5" />
                <span className="font-medium">Hasta 15% de reintegro</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Sorteo exclusivo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Legend */}
        <div className="mb-8">
          <BenefitsLegend />
        </div>

        {/* Grid Section */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Estado de las compras
            </h2>
            <p className="text-muted-foreground">
              Tocá sobre un número para ver más detalles
            </p>
          </div>
          
          <BenefitsGrid />
        </section>

        {/* Info Section */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-gray-100/70 rounded-xl p-6 border border-border">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              ¿Cómo funciona?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Realizá tu compra en nuestra tienda
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Automáticamente participás del sorteo exclusivo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Si estás entre los primeros 20, recibís un porcentaje de reintegro para tu próxima compra
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                El reintegro se acredita una vez finalizada tu siguiente compra
              </li>
            </ul>
          </div>
        </section>

        {/* TyC Section */}
        <section className="max-w-2xl mx-auto mt-12">
          <div className="bg-gray-100/70 rounded-xl p-6 border border-border">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Terminos y Condiciones
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                El reintegro tiene una vigencia de treinta (30) días desde el día de la primer compra, una vez transcurrido ese plazo, dejará de ser aplicable.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Los tres (3) premios del sorteo se revelan al llegar a la compra número treinta (30).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Una misma persona podrá participar en el sorteo con tantos números como compras haya realizado. Cada compra efectuada otorgará un (1) número de participación adicional.
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-2">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Promoción válida hasta agotar los 50 cupos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Benefits;