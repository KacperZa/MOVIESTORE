import { useUser } from '@/context/useUser'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useDeleteUser() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {user, setUser} = useUser()
    const navigate = useNavigate()

    const deleteUser = async () => {
        setLoading(true)
        setError(null)
        try {
        const res = await fetch(`http://localhost:5000/profile/delete/${user?._id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        })

        if(!res.ok) throw new Error(`HTTP Error: ${res.status}`)

        console.log('Deleted an account')
        navigate('/')
        setUser(null)
        const data = await res.json()
        console.log(data)
        return true 
        
        } catch (err){
        console.error(err)
        setError(err instanceof Error ? err.message : 'Undefined error')
        } finally {
            setLoading(false)
        }
    }
  
  return { deleteUser, loading, error}
}

export default useDeleteUser