import { useUser } from '@/context/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavouriteProps } from './useAddFavourite';

const useRemoveFavourite = () => {
    const { user } =  useUser()

    const queryClient = useQueryClient()

    const queryKey = ['favouriteIds', user?._id]

    const removeFavourite = async ({ id }: FavouriteProps) => {

        const res = await fetch(`http://localhost:5000/favourite/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })

        if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

       return await res.json()     
    }

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: removeFavourite,

        onSuccess: () => queryClient.invalidateQueries({queryKey}),

        onMutate: async (newFavourite) => {
            await queryClient.cancelQueries({queryKey})
            const previousFavourite = queryClient.getQueryData(queryKey)

        queryClient.setQueryData<Set<number>>(queryKey, (prev) => {
            const next = new Set(prev ?? [])
            next.delete(newFavourite.id)
            return next
        });
        return { previousFavourite }
        },

        onError: (_err, _newPost, context) => {
            queryClient.setQueryData(queryKey, context?.previousFavourite)
        }

    })

  return { mutate, isPending, isError, error}
}

export default useRemoveFavourite