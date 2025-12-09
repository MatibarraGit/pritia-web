import { Button } from "@/components/ui";

export default function UnauthorizedPage() {
  return (
    <main className="w-full min-h-content mx-auto center-flex">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-subheading">
            🛑✋ No Autorizado! ✋🛑
          </h1>
          <p className="text-dimmed">
            Por favor, iniciá sesión para continuar.
          </p>
        </div>

        <div>
          <Button 
            href="/auth/sign-in"
            className="w-full"  
          >Iniciar Sesión</Button>
          <Button 
            href="/"
            variant="outline"
            className="w-full mt-4"  
          >Volver al inicio</Button>
        </div>
      </div>
    </main>
  );
}
