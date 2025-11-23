import { Loader } from "lucide-react"

export const PageLoader = ({ text }: { text?: string }) => {
  return (
    <div className="w-full h-[calc(100dvh-120px)] flex flex-col items-center justify-center gap-4 bg-background">
      <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      <p>Cargando {text}...</p>
    </div>
  )
}
