import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/useUser"
import { motion } from "motion/react"
import { Button, PasswordInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import ThemeSwitch from "@/ui/ThemeSwitch"

interface HandleSubmitProps {
  username: string
  password: string
}

function Login() {

  const [ dataError, setDataError ] = useState(false)

  const { user, setUser } = useUser()
  const navigate = useNavigate()

  const HandleSubmit = async ({username, password} : HandleSubmitProps) => {

    try {
      const res = await fetch('http://localhost:5000/profile/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password})
      });
    
      const data = await res.json()
      
      
      if(res.ok){
        console.log('Zalogowano się')
        setUser(data)
        navigate('/')
        console.log(`Context to: `, user)
      }
      if(!res.ok){
        console.log("Error: ", res.status)
      }
    
      if(data.message === "Cannot find the user"){
        setDataError(true)
      } else {
        setDataError(false)
      }
      
    } catch (err) {
      console.error(err)
    }
  }
  

  const form = useForm({
    mode:"uncontrolled",
    initialValues: {
      username: '',
      password: ''
    }
  })


  return (
    <>
    <div className="bg-background p-6 flex flex-col justify-center gap-10 items-center w-screen h-screen text-text">

        <motion.div className="bg-secondary w-1/3 rounded-2xl p-7 flex flex-col gap-2 justify-center shadow-text shadow-md/15">
            <div className="text-3xl w-full font-bold flex justify-center">Login</div>
            <form 
            onSubmit={form.onSubmit((values) => HandleSubmit({username: values.username, password: values.password}))} 
            className="flex flex-col gap-4 w-full justify-center"
            >
              <div>
                <TextInput 
                label="Username" 
                placeholder='tomhanks123' 
                classNames={{ label:"!p-2 !text-lg", input: "!py-5"}} 
                key={form.key('username')}
                {...form.getInputProps('username')}/>
                <PasswordInput 
                label="Password" 
                classNames={{ label:"!p-2 !text-lg", input: "!py-5"}} 
                key={form.key('password')}
                {...form.getInputProps('password')} />
              </div>

                {dataError && <p className="text-red-500">Credentials are invalid or user doesn't exist.</p>}
                <div className="w-full flex flex-row justify-between">
                  <div className="font-medium font-inter">You don't have an account? Create one <Link to={'/register'} className="underline-animate text-primary">here</Link>! </div>
                  <Button color="green" size="md" className="shadow-lg/15" type="submit">Log in</Button>
                </div>

            </form>
        </motion.div>

        <ThemeSwitch />

    </div>
    </>
  )
}

export default Login