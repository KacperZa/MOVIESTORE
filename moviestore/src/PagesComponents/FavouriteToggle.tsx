import { useUser } from '@/context/useUser';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export interface FavouriteProps {
    e: React.MouseEvent<HTMLButtonElement>
    id: number | undefined
    type?: string | undefined
    setFavouriteIds: React.Dispatch<React.SetStateAction<Set<number>>>
}

function FavouriteToggle() {

const navigate = useNavigate()

    const { user } =  useUser()

      const addFavourite = async ({e, id, type, setFavouriteIds} : FavouriteProps) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id || !type) return

        if(user !== null) {
          try {
            const res = await fetch(`http://localhost:5000/favourite/${user._id}`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                mediaType: type,
                tmdbId: id,
              })
            })
    
            const data = await res.json()
            if(res.ok) {
              console.log(data)
              setFavouriteIds(prev => new Set([...prev, id]))
            } else {
              throw new Error(`HTTP error: ${res.status}`)

            }
          } catch(err) {
            console.error(err)
          }
          
        } else {
          navigate('/login')
        }
      }

      const removeFavourite = async ({e, id, setFavouriteIds}: FavouriteProps) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) return

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

        setFavouriteIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        
        })
        
        } catch(err) {
        console.error(err)
        }
      }

  return { addFavourite, removeFavourite }
}

export default FavouriteToggle