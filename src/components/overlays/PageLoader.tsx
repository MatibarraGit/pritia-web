import { MyLoader } from "@/components"

export const PageLoader = ({ text }: { text?: string }) => {
  return (
    <MyLoader className="w-full h-[calc(100dvh-120px)] center-flex flex-col gap-4 bg-background" text={`Cargando ${text}...`} />
  )
}
