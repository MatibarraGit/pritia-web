'use client'

import { Trash2 } from "lucide-react"
import { cartContext, toastContext } from "@/contexts"

interface CartButtonProps {
  id: number;
  disabled?: boolean;
}

export const IncreaseButton = ({ id, disabled = false }: CartButtonProps) => {
  const { increaseProductQuantity } = cartContext()

  return (
    <button 
      onClick={() => increaseProductQuantity(id)}
      className={`${disabled && 'opacity-50 cursor-not-allowed pointer-events-none'} px-2 py-1 border rounded hover:bg-gray-100`}
    >
      + 
    </button>
  )
}

export const DecreaseButton = ({ id, disabled = false }: CartButtonProps) => {
  const { decreaseProductQuantity } = cartContext()

  return (
    <button 
      onClick={() => decreaseProductQuantity(id)}
      className={`${disabled && 'opacity-50 cursor-not-allowed pointer-events-none'} px-2 py-1 border rounded hover:bg-gray-100`}
    >
      -
    </button>
  )
}

export const RemoveButton = ({ id }: { id: number }) => {
  const { removeFromCart } = cartContext()
  const { showToast } = toastContext()

  const handleClick = () => {
    removeFromCart(id)
    showToast('Producto eliminado del carrito', 'error')
  }

  return (
    <button 
      className='p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors' 
      onClick={handleClick}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}


