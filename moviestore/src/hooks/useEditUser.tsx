import { useUser } from '@/context/useUser'

interface handleSubmitProps {
  username: string | null
  email: string | null
  age: number | null
  password: string | null
}

const useEditUser = () => {

  const { user, setUser} = useUser()

    const editUser = async ({username, email, age, password}: handleSubmitProps) => {
        // e.preventDefault()
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
        
        if(!res.ok){
            console.error("ERROR: ", res.status)
            console.log(res)
        }
        setUser(data)
        console.log("USER: ", user)
        console.log(res.status, data)
        close()

        
        } catch (err) {
        console.error(err)
        }
}

  return { editUser }
}

export default useEditUser