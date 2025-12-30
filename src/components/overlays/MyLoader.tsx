import { Loader2 } from "lucide-react"

export const MyLoader = ({ className, text }: { className?: string, text?: string }) => {
  return (
    <div className={`${className ? className : 'w-full h-full absolute top-0 left-0 flex items-center justify-center bg-white/50 z-20'}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p>{text}</p>}
    </div>
  )
}
