import { useUser } from '@/context/useUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface HistoryProps {
    id: number
    userId: string | undefined
    type?: string | undefined
}

export interface HistoryPropsWithStatus extends HistoryProps{
  status: "pending" | "watched"
}

export type HistoryMap = "pending" | "watched"

const usePatchHistory = () => {

    const { user } = useUser()

    const queryClient = useQueryClient()
    const queryKey = ['historyIds', user?._id]

  const patchHistory = async ({ id, type, status}: HistoryPropsWithStatus) => {
      const res = await fetch(`http://localhost:5000/history/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              mediaType: type,
              tmdbId: id,
              status: status
            })
          })
      if(!res.ok) throw new Error(`HTTP status: ${res.status}`)

    return await res.json()
  }


  const { mutate, isPending } = useMutation({
    mutationFn: patchHistory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey});
    },

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({queryKey})
      const previousHistory = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<Map<number, HistoryMap>>(queryKey, (prev) => {
          const next = new Map(prev ?? [])
          next.set(newPost.id, newPost.status)
          return next
      });

      return { previousHistory }
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(queryKey, context?.previousHistory)
    }
  })
  return { mutate, isPending }
}

export default usePatchHistory