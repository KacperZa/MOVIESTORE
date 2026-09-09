import { useUser } from '@/context/useUser';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export interface HistoryProps {
    e: React.MouseEvent<HTMLButtonElement>
    id: number | undefined
    type?: string | undefined
}

interface HistoryPropsWithStatus extends HistoryProps{
  status: "pending" | "watched"
}


function HistoryToggle() {

const navigate = useNavigate()

  const { user } =  useUser()

  const queryClient = useQueryClient()

  const addHistory = async ({e, id, type, status} : HistoryPropsWithStatus) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || !type) return

    if (user === null) {
      navigate('/login')
      return
    }

    const queryKey = ['historyIds', user._id]

    queryClient.setQueryData<Map<number, "pending" | "watched">>(queryKey, (prev) => {
      const next = new Map(prev ?? [])
      next.set(id, status)
      return next
    })

    try {
        const res = await fetch(`http://localhost:5000/history/${user._id}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            mediaType: type,
            tmdbId: id,
            status: status
          })
        })
        if(!res.ok) throw new Error(`HTTP error: ${res.status}`)
          
        const data = await res.json()
        console.log(data)

    } catch(err) {
        console.error(err)
        queryClient.setQueryData<Map<number, "pending" | "watched">>(queryKey, (prev) => {
        const next = new Map(prev ?? [])
        next.delete(id)
        return next
        })
    }

  }

  const removeHistory = async ({e, id}: HistoryProps) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id || user === null) return

    const queryKey = ['historyIds', user._id]

    const previousStatus = queryClient.getQueryData<Map<number, "pending" | "watched">>(queryKey)?.get(id)

    queryClient.setQueryData<Map<number, "pending" | "watched">>(queryKey, (prev) => {
      const next = new Map(prev ?? [])
      next.delete(id)
      return next
    })

    try {
    const resDelete = await fetch(`http://localhost:5000/history/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    const dataDelete = await resDelete.json()
    console.log(dataDelete)

    if(!resDelete.ok) throw new Error(`HTTP error: ${resDelete.status}`)

    } catch(err) {
      console.error(err)

      queryClient.setQueryData<Map<number, "pending" | "watched">>(queryKey, (prev) => {
      const next = new Map(prev ?? [])
      if(previousStatus) next.set(id, previousStatus)
      return next
      })
    }
  }
    
  const patchHistory = async ({e, id, type, status}: HistoryPropsWithStatus) => {
    e.preventDefault();
    e.stopPropagation();

    if (user === null) {
      navigate('/login')
      return
    }

    // const queryKey = ['historyIds', user._id]


    try {
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

      const data = res.json()
      console.log(data)

    } catch(err) {
      console.error(err)
    }
        

  }

  return { addHistory, removeHistory, patchHistory }
}

export default HistoryToggle