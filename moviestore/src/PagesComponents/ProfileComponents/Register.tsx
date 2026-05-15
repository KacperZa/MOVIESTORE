import { motion } from "framer-motion"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { calculateAge } from "../UsefulFunctions"


function Login() {
const [ username, setUsername ] = useState('')
const [ email, setEmail ] = useState('')
const [ dateOfBirth, setDateBirth ] = useState('')
const [ password, setPassword ] = useState('')

const [ usernameError, setUsernameError ] = useState(false)
const [ emailError, setEmailError ] = useState(false)
const [ dateOfBirthError, setDateBirthError ] = useState(false)
const [ passwordError, setPasswordError ] = useState(false)

interface HandleChange {
  setSmth: (value: string) => void,
  e: React.ChangeEvent<HTMLInputElement>,
  validate: (value: string) => void
}

const navigate = useNavigate()


// Register function
const HandleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  if(usernameError || emailError || passwordError || !username || !password || !email || !dateOfBirth) return;
 const res =  await fetch('http://localhost:5000/profile/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({username, email, dateOfBirth, password })
  });

  const data = await res.json()

  if(res.ok){
    navigate('/login')
    console.log(data)
    setUsername('')
    setDateBirth('')
    setUsername('')
    setPassword('')
    console.log("Dane wysłane")
  } else {
    console.log("Nie udało sie");
    
  }
}


const validateDate = (val:string) => {
  
  const age = calculateAge(val)
  if(age <= 8 || age >= 70){
    setDateBirthError(true)
  } else {
    setDateBirthError(false)
  }
}

const validateUsername = (val: string) => {
  if (val.length < 4) {
    setUsernameError(true)
  } else {
    setUsernameError(false)
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
        <motion.div layout className="bg-gray-400 w-1/4 rounded-2xl p-7 flex flex-col gap-4">
            <div className="text-3xl  w-full font-medium justify-self-center">Register</div>
            <form onSubmit={(e) => HandleSubmit(e)} className="flex flex-col gap-3 w-full">

                <label>Username</label>
                <input onChange={(e) => HandleChange({setSmth: setUsername, e, validate: validateUsername})} className="h-12 px-4 py-2 w-2/3 rounded-lg select-none border-gray-300 bg-white" type="text" name="nickname" id="nickname" placeholder='Username' />
                {usernameError ? <p>Username must be at least 4 characters long!</p> : null}

                <label> E-mail </label>
                <input onChange={(e) => HandleChange({setSmth: setEmail, e, validate: validateEmail})} className="h-12 px-4 py-2 w-2/3 justify-self-center flex rounded-lg select-none border-gray-300 bg-white" type="text" name="email" id="email" placeholder='someone@example.com' />
                {emailError ? <p>Incorrect e-mail format! </p> : null}

                <label> Date of birth </label>
                <input onChange={(e) => HandleChange({setSmth: setDateBirth, e, validate: validateDate})} className="h-12 px-4 py-2 rounded-lg w-2/3 select-none  border-gray-300 bg-white" type="date" name="email" id="date" placeholder='Date' max={new Date().toISOString().split("T")[0]}/>
                {dateOfBirthError ? <p>I don't think this is your age.</p> : null}

                <label> Password </label>
                <input onChange={(e) => HandleChange({setSmth: setPassword, e, validate: validatePassword})} className="h-12 px-4 py-2  rounded-lg w-2/3 select-none border-gray-300 bg-white" type="password" name="" id="password" placeholder='Password' />
                {passwordError ? <p>Your password must be at least 8 characters long! </p> : null}

                <div className="flex flex-row">
                <button disabled={usernameError || emailError || passwordError} className={`py-4 px-6 ${usernameError || emailError || passwordError || !username || !password || !email || !dateOfBirth ? `bg-gray-600 cursor-not-allowed` : `bg-gray-500 cursor-pointer`}  w-fit justify-self-center rounded-xl`}>Submit</button>
                </div>

            </form>
        </motion.div>
    </div>
    </>
  )
}

export default Login