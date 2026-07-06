import Link from "next/link"
import { Monitor, Smartphone, Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ProductsPage() {
  const sections = [
    {
      title: "Panel Desktop",
      description: "Gestionar productos en vista de escritorio",
      icon: Monitor,
      href: "/admin/products/desktop-panel",
    },
    {
      title: "Panel Mobile",
      description: "Gestionar productos en vista móvil",
      icon: Smartphone,
      href: "/admin/products/mobile-panel",
    },
    {
      title: "Nuevo Producto",
      description: "Crear un nuevo producto",
      icon: Plus,
      href: "/admin/products/new",
    },
  ]

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Gestión de Productos</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
