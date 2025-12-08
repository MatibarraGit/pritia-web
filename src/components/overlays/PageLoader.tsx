import { MyLoader } from "@/components"

export const PageLoader = ({ text }: { text?: string }) => {
  return (
    <MyLoader className="w-full min-h-content center-flex flex-col gap-4 bg-background" text={`Cargando ${text}...`} />
  )
}
