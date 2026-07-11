import { useUser } from '@/context/useUser';
import React from 'react'
import type { Films } from './MediaCard';
import { useNavigate } from 'react-router-dom';

export interface FavouriteProps {
    e: React.MouseEvent<HTMLButtonElement>
    media: Films
    type?: string
    setFavouriteIds: React.Dispatch<React.SetStateAction<Set<number>>>
}

function FavouriteToggle() {

const navigate = useNavigate()

    const { user } =  useUser()

      const addFavourite = async ({e, media, type, setFavouriteIds} : FavouriteProps) => {
        e.preventDefault();
        e.stopPropagation();
        if(user !== null) {
          try {
            const res = await fetch(`http://localhost:5000/favourite/add/${user._id}`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                userId: user._id,
                mediaType: type,
                tmdbId: media.id,
                adult: media.adult,
                backdrop_path: media.backdrop_path,
                genre_ids: media.genre_ids,
                original_language: media.original_language,
                original_title: media.original_title,
                overview: media.overview,
                popularity: media.popularity,
                poster_path: media.poster_path,
                release_date: media.release_date,
                title: type === "tv" ? media.name : media.title,
                video: media.video,
                vote_average: media.vote_average,
                vote_count: media.vote_count
              })
            })
    
            const data = await res.json()
            if(res.ok) {
              console.log(data)
              setFavouriteIds(prev => new Set([...prev, media.id]))
            }
          } catch(err) {
            console.error(err)
          }
          
        } else {
          navigate('/login')
        }
      }

      const removeFavourite = async ({e, media, setFavouriteIds}: FavouriteProps) => {
        e.preventDefault();
        e.stopPropagation();
        try {
        const resDelete = await fetch(`http://localhost:5000/favourite/${media.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        const dataDelete = await resDelete.json()
        console.log(dataDelete)

        if (!resDelete.ok) {
            console.error(dataDelete.message)
            return
        }

        setFavouriteIds(prev => new Set([...prev].filter(id => id !== media.id)))
        
        } catch(err) {
        console.error(err)
        }
      }

  return { addFavourite, removeFavourite }
}

export default FavouriteToggle