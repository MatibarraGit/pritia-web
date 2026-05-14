import { useEffect, useState, useMemo, useRef, startTransition } from 'react'
import { usePathname } from 'next/navigation'

export function useSearch () {
  // Validaciones para la búsqueda
  const [search, setSearch] = useState('')
  const prevPathnameRef = useRef<string>('')

  // Calcular el error de forma derivada en lugar de usar useEffect
  const error = useMemo(() => {
    const trimmedSearch = search.trim()
    
    if (trimmedSearch === '') {
      return 'No se puede hacer una búsqueda vacía'
    }

    if (trimmedSearch.match(/^\d+$/)) {
      return 'No se puede hacer una búsqueda con un número'
    }

    return ''
  }, [search])

  // Borrar el resultado de la búsqueda cuando se cambie de ruta
  const pathname = usePathname()

  useEffect(() => {
    const wasInSearchResults = prevPathnameRef.current.includes('/busqueda/')
    const isInSearchResults = pathname.includes('/busqueda/')
    
    // Solo resetear si salimos de una ruta de búsqueda
    // Usamos startTransition para evitar renders en cascada
    if (wasInSearchResults && !isInSearchResults) {
      startTransition(() => {
        setSearch('')
      })
    }
    
    prevPathnameRef.current = pathname
  }, [pathname])

  return { search, setSearch, error }
}