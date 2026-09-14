import { useUser } from '@/context/useUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { HistoryMap, HistoryProps } from './usePatchHistory'

const useRemoveHistory = () => {

    const queryClient = useQueryClient()
    const { user } = useUser()

    const queryKey = ['historyIds', user?._id]

      const removeHistory = async ({ id }: HistoryProps) => {
        const resDelete = await fetch(`http://localhost:5000/history/${id}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
        })
        if(!resDelete.ok) throw new Error(`HTTP error: ${resDelete.status}`)
          
        const dataDelete = await resDelete.json()
        console.log(dataDelete)
      }

    // TanStack optimistic add function
  const { mutate, isPending } = useMutation({
    mutationFn: removeHistory,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historyIds', user?._id]});
    },

    onMutate: async (newPost) => {
        await queryClient.cancelQueries({queryKey: ['historyIds', user?._id]})
        const previousHistory = queryClient.getQueryData(['historyIds', user?._id]);

        queryClient.setQueryData<Map<number, HistoryMap>>(queryKey, (prev) => {
            const next = new Map(prev ?? [])
            next.delete(newPost.id)
            return next
        })

        return { previousHistory }
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['historyIds', user?._id], context?.previousHistory)
    }

  })

  return { mutate, isPending }
}

export default useRemoveHistory