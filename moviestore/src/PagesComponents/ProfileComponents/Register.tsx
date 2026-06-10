import { motion } from "framer-motion"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { calculateAge } from "../UsefulFunctions"
import { Password } from 'primereact/password';
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";




function Login() {
const [ username, setUsername ] = useState('')
const [ email, setEmail ] = useState('')
const [ dateOfBirth, setDateBirth ] = useState<Date | null>(null)
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
        <motion.div layout className="bg-gray-400 w-1/4 rounded-2xl p-7 flex flex-col gap-4 shadow-lg">
            <div className="text-3xl  w-full font-medium justify-self-center">Register</div>
            <form onSubmit={(e) => HandleSubmit(e)} className="flex flex-col gap-3 w-full">

                  <label>Username</label>
                  <InputText 
                  placeholder="Megamix2000"
                  invalid={usernameError}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => HandleChange({setSmth: setUsername, e, validate: validateUsername})}
                    pt={{
                      root: {className: 'h-12 px-4 py-2 w-2/3 rounded-lg select-none border-gray-300 bg-white'}
                    }} />
                {/* <input onChange={(e) => HandleChange({setSmth: setUsername, e, validate: validateUsername})} className="h-12 px-4 py-2 w-2/3 rounded-lg select-none border-gray-300 bg-white" type="text" name="nickname" id="nickname" placeholder='Username' />*/}
                {usernameError ? <p className="text-red-700">Username must be at least 4 characters long!</p> : null} 

                <label> E-mail </label>
                <InputText 
                placeholder="andrzej.kowalski123@op.pl"
                invalid={emailError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => HandleChange({setSmth: setEmail, e, validate: validateEmail})}
                  pt={{
                    root: {className: 'h-12 px-4 py-2 w-2/3 justify-self-center flex rounded-lg select-none border-gray-300 bg-white'}
                  }} />
                {/* <input onChange={(e) => HandleChange({setSmth: setEmail, e, validate: validateEmail})} className="h-12 px-4 py-2 w-2/3 justify-self-center flex rounded-lg select-none border-gray-300 bg-white" type="text" name="email" id="email" placeholder='someone@example.com' />*/}
                {emailError ? <p className="text-red-700">Incorrect e-mail format! </p> : null} 

                <label> Date of birth </label>
                <Calendar 
                appendTo='self'
                showButtonBar
                invalid={dateOfBirthError}
                onChange={(e) => {
                  const value = e.value as Date;
                  setDateBirth(value)
                  validateDate(value.toISOString())  
                }}
                value={dateOfBirth}
                pt={{
                  root: {className: 'w-2/3'},
                  input: {className: 'w-full h-12 px-4 py-2 rounded-lg w-2/3 select-none  border-gray-300 bg-white'},
                  panel: {className: 'h-3.5/10 w-1/3 !left-full !top-0 !mt-0 !ml-2'}
                }}
                placeholder="12.06.2005" maxDate={new Date()}/>

                {/* <input onChange={(e) => HandleChange({setSmth: setDateBirth, e, validate: validateDate})} className="h-12 px-4 py-2 rounded-lg w-2/3 select-none  border-gray-300 bg-white" type="date" name="email" id="date" placeholder='Date' max={new Date().toISOString().split("T")[0]}/> */}
                {dateOfBirthError ? <p className="text-red-700">I don't think this is your age.</p> : null}

                <label> Password </label>

                {/* <Password  toggleMask value={password} onChange={(e) => HandleChange({setSmth: setPassword, e, validate: validatePassword})} 
                pt={{
                  root: {className: 'flex w-3/3' },
                  input: {className: '!flex-1 h-12 !px-4 !py-2  rounded-lg  select-none border-gray-300 bg-white'},
                  panel: {className: 'shadow-lg'},
                  showIcon: { className: 'ml-2' },
                  hideIcon: { className: 'ml-2' },    

                }}></Password> */}
                <input onChange={(e) => HandleChange({setSmth: setPassword, e, validate: validatePassword})} className="h-12 px-4 py-2 w-2/3 justify-self-center flex rounded-lg select-none border-gray-300 bg-white" type="password" name="" id="password" placeholder='Password' />
                 {passwordError ? <p className="text-red-700">Your password must be at least 8 characters long! </p> : null} 

                <div className="flex flex-row">
                <button disabled={usernameError || emailError || passwordError} className={`py-4 px-6  ${usernameError || emailError || passwordError || !username || !password || !email || !dateOfBirth ? `bg-gray-600 cursor-not-allowed` : `bg-gray-500 cursor-pointer`}  w-fit justify-self-center rounded-xl`}>Submit</button>
                </div>

            </form>
        </motion.div>
    </div>
    </>
  )
}

export default Login