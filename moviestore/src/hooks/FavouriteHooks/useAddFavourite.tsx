import { useUser } from '@/context/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface FavouriteProps {
    id: number,
    type: string,
    userId: string | undefined
}

const useAddFavourite = () => {
    const queryClient = useQueryClient()

    const { user } =  useUser()
    const queryKey = ['favouriteIds', user?._id]
    
    
    const addFavourite = async ({userId, id, type} : FavouriteProps) => {
        const res = await fetch(`http://localhost:5000/favourite/${userId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            mediaType: type,
            tmdbId: id,
            })
        })
        if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

        return await res.json()
    }

    // TanStack optimistic add function
    const { mutate, isPending } = useMutation({
    mutationFn: addFavourite,

    onSuccess: () => queryClient.invalidateQueries({ queryKey}),

    onMutate: async (newFavourite) => {
        await queryClient.cancelQueries({queryKey})
        const previousFavourite = queryClient.getQueryData(queryKey)

        queryClient.setQueryData<Set<number>>(queryKey, (prev) => {
            const next = new Set(prev ?? [])
            next.add(newFavourite.id)
            return next
        });
        return { previousFavourite }
    },

    onError: (_err, _newPost, context) => {
        queryClient.setQueryData(queryKey, context?.previousFavourite)
    }
        
    })

  return { mutate, isPending }
}

export default useAddFavourite