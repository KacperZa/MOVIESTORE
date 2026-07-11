import React, { useCallback, useRef } from 'react'

interface InfinityScrollProps {
    loading: boolean
    pastScrollHeight: React.RefObject<number>
    setPage: (value: React.SetStateAction<number>) => void
    topDiv: React.RefObject<HTMLDivElement | null>
    hasMore: boolean
}

function useInfiniteScroll({loading, pastScrollHeight, setPage, topDiv, hasMore} : InfinityScrollProps) {

const observer = useRef<IntersectionObserver | null>(null)

  const lastMediaElementRef = useCallback((node: HTMLDivElement | null)  => {
    if (loading) return;
    if (observer.current) observer.current.disconnect()
    if (!pastScrollHeight) return;

      observer.current = new IntersectionObserver(entries =>  {
        if ( entries[0].isIntersecting && hasMore){
          pastScrollHeight.current = topDiv.current?.scrollHeight ?? 0
          setPage(prevPageNumber => prevPageNumber + 1)
        }
      })
  if (node) observer.current.observe(node)
  },[loading, hasMore, pastScrollHeight, topDiv])

  return lastMediaElementRef
}

export default useInfiniteScroll