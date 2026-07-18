import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button, NumberInput, PasswordInput, TextInput } from "@mantine/core"
import { AtSignIcon, Calendar, User, Lock } from "lucide-react"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"
// import { Password } from 'primereact/password';
// import { InputText } from "primereact/inputtext";
// import { Calendar } from "primereact/calendar";



interface HandleRegisterProps {
  username: string
  email: string
  age: number
  password: string
}



function Login() {


  const [visible, { toggle }] = useDisclosure(false)
  const navigate = useNavigate()


  // Register function
  const HandleRegister = async ({username, email, age, password} : HandleRegisterProps) => {

    try{
      const res =  await fetch('http://localhost:5000/profile/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({username, email, age, password })
        });
    
        const data = await res.json()
    
        if(res.ok){
          navigate('/login')
          console.log(data)
          console.log("Dane wysłane")
        } else {
          console.log("Nie udało sie");
        }

    } catch(err){
      console.error(err)
    }
  }


  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      email: '',
      age: 0,
      password: '',
      secondPassword: ''
    },

    validate: {
      username: (value: string) => (value.trim().length > 4 ? null : 'Your username have at least 4 characters'),
      email: (value: string) => (/^[\w.-]+@[a-z\d.-]+\.[a-z]{2,}$/.test(value) ? null : 'Incorrect e-mail format!'),
      age: (value: number) => (value < 5 || value > 100 ? 'I dont think this is your age...' : null ),
      password: (value: string) => (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*().,?":{}|<>_-}]).{9,}$/.test(value) ? null : 'Password must be at least 9 characters and include an uppercase letter, a lowercase letter, a number, and a special character.'),
      secondPassword: (value, values) => (value === values.password ? null : `Password don't match!`)
    }
  })

  return (
    <>
    <div className="bg-gray-200 p-6 flex justify-center items-center w-screen h-screen">
        <motion.div layout className="bg-gray-400 w-1/4 rounded-2xl p-7 flex flex-col gap-4 shadow-lg">
            <div className="text-3xl  w-full font-medium justify-self-center">Register</div>
            <form onSubmit={form.onSubmit((values) => {
              HandleRegister({username: values.username, email: values.email, age: values.age, password: values.password})
              form.reset()
            })} className="flex flex-col gap-3 w-full">
              <TextInput
              withAsterisk
              placeholder="Johndore1232"
              label="Username"
              leftSection={<User size={16} />}
              key={form.key('username')}
              {...form.getInputProps('username')}
              />
              <TextInput
              withAsterisk
              placeholder="John.dore@1232.com"
              label="E-mail"
              leftSection={<AtSignIcon size={16} />}
              key={form.key('email')}
              {...form.getInputProps('email')}
              />

              <NumberInput
              withAsterisk
              placeholder="0"
              label="Age"
              leftSection={<Calendar size={16}/>}
              key={form.key('age')}
              {...form.getInputProps('age')}
              
              />

              <PasswordInput
              withAsterisk 
              label="Password"
              placeholder='Password'
              leftSection={<Lock size={16}/>}
              visible={visible}
              onVisibilityChange={toggle}
              key={form.key('password')}
              {...form.getInputProps('password')}
              />
              
              <PasswordInput
              withAsterisk 
              label="Confirm your Password"
              placeholder='Password'
              leftSection={<Lock size={16}/>}
              visible={visible}
              onVisibilityChange={toggle}
              key={form.key('secondPassword')}
              {...form.getInputProps('secondPassword')}
              
              />

                <div className="flex flex-row">
                  <Button className="shadow-lg/15" color="green" type="submit">Submit</Button>
                </div>

            </form>
        </motion.div>
    </div>
    </>
  )
}

export default Login