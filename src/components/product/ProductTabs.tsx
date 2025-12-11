import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  description: string;
}

export function ProductTabs({ description }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description">
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent px-4 py-2" //data-[state=active]:border-primary data-[state=active]:text-primary
        >
          Descripción
        </TabsTrigger>
        {/* <TabsTrigger
          value="specifications"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 py-2"
        >
          Especificaciones
        </TabsTrigger> */}
      </TabsList>
      <TabsContent value="description" className="pt-6">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-700 mb-6">
            {description || "No hay descripción disponible para este producto."}
          </p>
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="pt-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Especificaciones se pueden agregar más adelante */}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

