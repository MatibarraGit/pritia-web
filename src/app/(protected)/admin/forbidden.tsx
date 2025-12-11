import { Button } from "@/components/ui";

export default function ForbbidenPage() {
  return (
    <main className="w-full min-h-content mx-auto center-flex">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-subheading">
            No tenés permisos para acceder a esta página
          </h1>
        </div>

        <div>
          <Button href="/">Volver al inicio</Button>
        </div>
      </div>
    </main>
  );
}
