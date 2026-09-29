import { useUser } from '@/context/useUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface HistoryProps {
  tmdbId: number
  userId: string | undefined
  mediaType?: string | undefined
}

export interface HistoryPropsWithStatus extends HistoryProps{
  status: "pending" | "watched"
}
export interface PatchHistoryProps {
  tmdbId: number
  mediaType?: string | undefined
  status: "pending" | "watched"
}

export type HistoryMap = "pending" | "watched"

const usePatchHistory = () => {

    const { user } = useUser()

    const queryClient = useQueryClient()
    const queryKey = ['historyIds', user?._id]

  const patchHistory = async ({ tmdbId, mediaType, status }: PatchHistoryProps) => {
      const res = await fetch(`http://localhost:5000/history/${tmdbId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          mediaType: mediaType,
          tmdbId: tmdbId,
          status: status
        })
      })
      if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

    return await res.json()
  }


  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: patchHistory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey});
    },

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({queryKey})
      const previousHistory = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<Map<number, HistoryMap>>(queryKey, (prev) => {
          const next = new Map(prev ?? [])
          next.set(newPost.tmdbId, newPost.status)
          return next
      });

      return { previousHistory }
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(queryKey, context?.previousHistory)
    }
  })
  return { mutate, isPending, isError, error }
}

export default usePatchHistory