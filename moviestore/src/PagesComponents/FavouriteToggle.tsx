import { useUser } from '@/context/useUser';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export interface FavouriteProps {
    e: React.MouseEvent<HTMLButtonElement>
    id: number | undefined
    type?: string | undefined
}

function FavouriteToggle() {

const navigate = useNavigate()

    const { user } =  useUser()

    const queryClient = useQueryClient()

      const addFavourite = async ({e, id, type} : FavouriteProps) => {
        console.log('user._id in toggle:', user?._id)
        e.preventDefault();
        e.stopPropagation();

        if (!id || !type) return

        if (user === null) {
          navigate('/login')
          return
        }

        const queryKey = ['favouriteIds', user._id]

        queryClient.setQueryData<Set<number>>(queryKey, (prev) => {
          const next = new Set(prev ?? [])
          next.add(id)
          return next
        })

          try {
            const res = await fetch(`http://localhost:5000/favourite/${user._id}`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                mediaType: type,
                tmdbId: id,
              })
            })
            if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

            const data = await res.json()
            console.log(data)

          } catch(err) {
            console.error(err)
            queryClient.setQueryData<Set<number>>(queryKey, (prev) => {
            const next = new Set(prev ?? [])
            next.delete(id)
            return next
        })
          }

      }

      const removeFavourite = async ({e, id}: FavouriteProps) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id || user === null) return

        const queryKey = ['favouriteIds', user._id]

        queryClient.setQueryData<Set<number>>(queryKey, (prev) => {
          const next = new Set(prev ?? [])
          next.delete(id)
          return next
        })

        try {
        const resDelete = await fetch(`http://localhost:5000/favourite/${id}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
        })
        const dataDelete = await resDelete.json()
        console.log(dataDelete)

        if (!resDelete.ok) {
          console.error(dataDelete.message)
          return
        }
          if(!resDelete.ok) throw new Error(`HTTP error: ${resDelete.status}`)


        
        } catch(err) {
          console.error(err)

          queryClient.setQueryData<Set<number>>(queryKey, (prev) => {
          const next = new Set(prev ?? [])
          next.add(id)
          return next
          })
        }
      }

  return { addFavourite, removeFavourite }
}

export default FavouriteToggle