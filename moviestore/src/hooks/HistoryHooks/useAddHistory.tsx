import { useUser } from '@/context/useUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { HistoryMap, HistoryPropsWithStatus } from './usePatchHistory'

const useAddHistory = () => {

    const queryClient = useQueryClient()

    const { user } = useUser()

    const addHistory = async ({ userId, id, type, status} : HistoryPropsWithStatus) => {

        const res = await fetch(`http://localhost:5000/history/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            mediaType: type,
            tmdbId: id,
            status: status
            })
        })

        if(!res.ok) throw new Error(`HTTP error: ${res.status}`)
        return await res.json()
    }
    
// TanStack optimistic add function
  const { mutate, isPending } = useMutation({
    mutationFn: addHistory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historyIds', user?._id]});
    },

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({queryKey: ['historyIds', user?._id]})
      const previousHistory = queryClient.getQueryData(['historyIds', user?._id]);

      queryClient.setQueryData<Map<number, HistoryMap>>(['historyIds', user?._id], (prev) => {
      const next = new Map(prev ?? [])
      next.set(newPost.id, newPost.status)
      return next
    })

    return { previousHistory }
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['historyIds', user?._id], context?.previousHistory)
    }

  })

  return { mutate, isPending}
}

export default useAddHistory