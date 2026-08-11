import { useEffect } from 'react'

interface ClickOutsideProps<T extends HTMLElement> {
    ref: React.RefObject<T | null>
    callback: () => void
}

export function useClickOutside<T extends HTMLElement>({ ref, callback } : ClickOutsideProps<T>) {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                callback()
            }
        }
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    }, [ref, callback])
}