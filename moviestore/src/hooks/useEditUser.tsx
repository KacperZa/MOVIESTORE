import { useUser } from '@/context/useUser'
import { useState } from 'react'

interface handleSubmitProps {
  username: string | null
  email: string | null
  age: number | null
  password: string | null
}

const useEditUser = () => {
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

  const { user, setUser} = useUser()

    const editUser = async ({username, email, age, password}: handleSubmitProps) => {
      setLoading(true)
      setError(null)
      try {
      const res = await fetch(`http://localhost:5000/profile/${user?._id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username, 
          email, 
          age, 
          password
        })
      })

      const data = await res.json()
      
      if(!res.ok) throw new Error(`HTTP error: ${res.status}`)

      setUser(data)
      console.log("USER: ", user)
      console.log(res.status, data)
      
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
  }

  return { editUser, loading, error }
}

export default useEditUser