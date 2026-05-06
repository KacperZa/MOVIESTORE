import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/useUser"
import { motion } from "motion/react"

function Login() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ emailError, setEmailError ] = useState(false)
  const [ passwordError, setPasswordError ] = useState(false)
  
interface HandleChange {
  setSmth: (value: string) => void,
  e: React.ChangeEvent<HTMLInputElement>,
  validate: (value: string) => void
}

const { user, setUser } = useUser()
const navigate = useNavigate()

const HandleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  if(emailError || passwordError || !email || !password) return;

  const res = await fetch('http://localhost:5000/profile/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password})
  });

  const data = await res.json()
  
  
  if(res.ok){
    console.log('Zalogowano się')
    navigate('/')
    setUser(data)
    console.log(`Context to: `, user)
  }
  if(!res.ok){
    console.log('No nie udalo sie')
  }
}

const validateEmail = (val: string) => {
  
  const emailCheck = /^[\w.-]+@[a-z\d.-]+\.[a-z]{2,}$/.test(val)

  if(!emailCheck){
    setEmailError(true)
  } else{
    setEmailError(false)
  }
}

const validatePassword = (val: string) => {
  if(val.length < 8) {
    setPasswordError(true)
  } else {
    setPasswordError(false)
  }
}

const HandleChange = ({setSmth, e, validate} : HandleChange) => {
  const value = e.target.value
  setSmth(value)
  validate(value)
}


  return (
    <>
    <div className="bg-gray-200 p-6 flex justify-center items-center w-screen h-screen">
        <motion.div layout className="bg-gray-400  rounded-2xl p-7 flex flex-col gap-4 justify-center">
            <div className="text-3xl w-full font-medium ">Login</div>
            <form onSubmit={(e) => HandleSubmit(e)} method="POST" className="flex flex-col gap-3">

                <label> E-mail </label>
                <input onChange={(e) => HandleChange({setSmth: setEmail, e, validate: validateEmail})} className="w-2xl h-12 px-4 py-2 rounded-lg select-none border-gray-300 bg-white" type="text" name="email" id="input" placeholder='someone@example.com' />
                {emailError ? <p>Incorrect e-mail format! </p> : null}

                <label> Password </label>
                <input onChange={(e) => HandleChange({setSmth: setPassword, e, validate: validatePassword})} className="w-2xl h-12 px-4 py-2 rounded-lg select-none border-gray-300 bg-white" type="password" name="" id="input" placeholder='Password' />
                {passwordError ? <p>Your password must be at least 8 characters long! </p> : null}

                <button disabled={emailError || passwordError} className={`py-4 px-6 ${emailError || passwordError || !password || !email  ? `bg-gray-600 cursor-not-allowed` : `bg-gray-500 cursor-pointer`}  w-fit justify-self-center rounded-xl`}>Submit</button>
            </form>
            <div className="font-medium">You don't have an account? Create one <Link to={'/register'} className="underline-anim">here</Link>! </div>
        </motion.div>
    </div>
    </>
  )
}

export default Login