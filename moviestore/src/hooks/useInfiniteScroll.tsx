import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import type { FetchMediaResults } from './useFetchMedia'

interface InfinityScrollProps {
    loading: boolean
    fetch: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<FetchMediaResults, unknown>, Error>>
    hasMore: boolean
}

function useInfiniteScroll({loading, fetch, hasMore} : InfinityScrollProps) {

const observer = useRef<IntersectionObserver | null>(null)

  const lastMediaElementRef = useCallback((node: HTMLDivElement | null)  => {
    if (loading) return;
    if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries =>  {
        if ( entries[0].isIntersecting && hasMore){
          fetch()
        }
      },
    {threshold: 1}
    )
  if (node) observer.current.observe(node)
  },[loading, hasMore, fetch])

  return lastMediaElementRef
}

export default useInfiniteScroll