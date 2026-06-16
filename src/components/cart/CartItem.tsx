'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from "lucide-react"

import { IncreaseButton, DecreaseButton, RemoveButton } from '../buttons/CartButtons';
import { CartItemType } from '@/types';
import { formatPrice } from '@/utils';

export const CartItem = ({ 
  id,
  image,
  name, 
  price,
  originalPrice,
  quantity, 
  slug,
}: CartItemType) => {
  return (
    <article className="flex gap-4">
      {/* Imagen del producto */}
      <Link 
        className="h-20 w-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden"
        href={`/producto/${slug}`}
      >
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            width={80} 
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </Link>

      {/* Información del producto */}
      <div className="flex-1 flex flex-col justify-between">
        <Link href={`/producto/${slug}`} className="hover:text-primary transition-colors">
          <span className="font-medium text-sm block mb-1">{name}</span>

          <div className="flex items-center gap-2 text-sm">
            {originalPrice && originalPrice > price ? (
              <>
                <span className="font-subheading text-primary">{formatPrice(price)}</span>
                <span className="text-gray-500 line-through">{formatPrice(originalPrice)}</span>
              </>
            ) : (
              <span className="font-subheading text-primary">{formatPrice(price)}</span>
            )}
          </div>
        </Link>

        <footer className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {quantity <= 1
              ? <DecreaseButton id={id} disabled />
              : <DecreaseButton id={id} />
            }

            <span className="text-sm w-full text-center text-nowrap">Cant: {quantity}</span>

            {quantity >= 100 
              ? <IncreaseButton id={id} disabled />
              : <IncreaseButton id={id} />
            }
          </div>
          <RemoveButton id={id} />
        </footer>
      </div>
    </article>
  );
};


