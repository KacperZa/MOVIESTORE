import { motion } from 'motion/react'
import React, { useState } from 'react'
import { EditIcon } from '../../components/Icons'
import { useUser } from '../../context/useUser'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom'


function Profile() {

  interface ChangeProps {
    e: React.ChangeEvent<HTMLInputElement>,
    setSmth: (value: string) => void
  }
  const [editMode, setEditMode] = useState(false)
  const [passwdEditMode, setPasswdEditMode] = useState(false)

  const {setUser, user} = useUser()

  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? '')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')

  const [passwdError, setPasswdError] = useState(false)

  const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate()


  const handleChange = ({e, setSmth} : ChangeProps) => {
    const value = e.target.value
    setSmth(value)
  }

  // const handlePasswordSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  //   handleSubmit(e)
  //   setPassword('')
  //   setSecondPassword('')
  // }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/profile/${user?._id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, dateOfBirth, password})
      })

      if(passwdEditMode){
        setPassword('')
        setSecondPassword('')
      }
  
      const data = await res.json()
      setUser(data)
      console.log(res.status, data)
  
      if(data.ok){
        console.log("ITS OK")
      }
      
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/profile/delete/${user?._id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      })

      if(!res.ok){
        console.error('Error', res.status)
        return
      }
      if(res.ok){
        console.log('Deleted an account')
        navigate('/')
        setUser(null)
      }

      const data = await res.json()
      console.log(data)

      
    } catch (err){
      console.error(err)
    }
  }

  const footerContent = (
    <div className='flex justify-around'>
      <Button label='No' icon='pi pi-times' onClick={() => console.log('Tak')}></Button>
      <Button label='Yes' icon='pi pi-check' onClick={() => handleDelete()}></Button>
    </div>
  )


  return (
  <>
    <motion.div layout className=" ml-5 flex flex-8 flex-col bg-blue-400 rounded-2xl p-2 w-screen justify-center items-center">
      <div className="flex w-2/3 h-7/8 flex-col">
          <p className='flex font-bold text-6xl p-14 justify-center text-white'>{user?.username.toUpperCase()}</p>
          <motion.div layout className='bg-blue-500 h-fit w-full p-8 flex flex-col gap-7 rounded-2xl shadow-xl/30 shadow-black'>
            <div id="buttons" className="flex-row flex justify-evenly gap-1 ">
              <button className='size-fit py-5 px-15 bg-blue-600 rounded-lg font-medium text-xl shadow-xl/20 shadow-black'>DANE</button>
              <button className='size-fit py-5 px-15 bg-blue-600 rounded-lg font-medium text-xl shadow-xl/20 shadow-black'>KONTO</button>  
            </div>
            <form onSubmit={(e) => handleSubmit(e)} id="dane" className="flex flex-col items-center">
              <div className="grid grid-cols-2">

                {passwdEditMode ? 
                <>
                <div className="flex flex-col p-11 gap-6 text-2xl">
                  <label htmlFor="password" className='font-semibold'>Password</label>
                  <input type="text" onChange={(e) => {handleChange({e, setSmth: setPassword}); setPasswdError(e.target.value !== secondPassword)}} value={password} name="password" id="password" className={`bg-[#D9D9D9] text-gray-600 rounded-xl flex-1 py-3 px-6 `}/>
                </div>

                <div className="flex flex-col p-11 gap-6 text-2xl">
                  <label htmlFor="secondPassword" className='font-semibold'>Confirm your Password</label>
                  <input type="text" onChange={(e) => {handleChange({e, setSmth: setSecondPassword}); setPasswdError(e.target.value !== password)}} value={secondPassword} name="secondPassword" id="secondPassword" className={`bg-[#D9D9D9] text-gray-600 rounded-xl flex-1 py-3 px-6 `} />
                </div>
                  {passwdError ? 
                <div className='flex justify-center col-span-2'>
                  <div className='flex px-11 py-2 bg-red-400/80 rounded-l justify-self-center'>
                    Password are not the same!
                  </div>

                </div>
                  :
                null
                  }
                </>
                : 
                <>
                <div className="flex flex-col p-11 gap-6 text-2xl">
                  <label htmlFor="username" className='font-semibold'>Username</label>
                  <input type="text" disabled={!editMode} onChange={editMode ? (e) => handleChange({e, setSmth: setUsername}): undefined} name="username" value={username} id="username" className={`${!editMode ? 'bg-[#b1b1b1] text-gray-600' : 'bg-[#D9D9D9]'} rounded-xl flex-1 py-3 px-6 `}/>
                </div>

                <div className="flex flex-col p-11 gap-6 text-2xl">
                  <label htmlFor="email" className='font-semibold'>E-mail</label>
                  <input type="text" disabled={!editMode} onChange={editMode ? (e) => handleChange({e, setSmth: setEmail}): undefined} name="username" id="" value={email} className={`${!editMode ? 'bg-[#b1b1b1] text-gray-600' : 'bg-[#D9D9D9]'} rounded-xl flex-1 py-3 px-6 `} />
                </div>

                <div className="flex flex-col p-11 gap-6 text-2xl col-span-2">
                  <label htmlFor="date" className='font-semibold'>Date of birth</label>
                  <input type="date" disabled={!editMode} onChange={editMode ? (e) => handleChange({e, setSmth: setDateOfBirth}): undefined} name="username" id="" value={dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : ''} className={`${!editMode ? 'bg-[#b1b1b1] text-gray-600' : 'bg-[#D9D9D9]'} rounded-xl flex-1 py-3 px-6`}/>
                </div>
                </>
                }




              </div>
              <div id="edit" className="flex justify-center items-center w-fit gap-10 p-5">
                {editMode || passwdEditMode ?
                  <motion.button layout type='submit' onClick={() => setEditMode(false)} className='bg-gray-400 py-3 px-8 rounded-lg font-medium  shadow-xl/15 shadow-black cursor-pointer'>Submit</motion.button>
                  :
                  <motion.button layout type='submit' onClick={() => setEditMode(true)} className='bg-gray-400 py-3 px-8 rounded-lg font-medium  shadow-xl/15 shadow-black flex justify-center cursor-pointer'> <EditIcon color='black'/></motion.button>
                }
                <motion.button layout type='button' onClick={() => setPasswdEditMode(true)} className='relative py-4 px-8 shadow-xl/15 cursor-pointer shadow-black bg-gray-400 rounded-lg font-medium '>Change password</motion.button>
                {/* <motion.button layout type='button' onClick={handleDeleteButton} className='relative py-4 px-8 shadow-xl/15 cursor-pointer shadow-black bg-black rounded-lg font-medium text-red-500 border-red-500 border-2'>Delete the account</motion.button> */}
                <div className="card flex justify-content-center">
                    <Button label="Show" icon="pi pi-external-link"  onClick={() => setOpenModal(true)} />
                    <Dialog header="Header" footer={footerContent} modal visible={openModal} maximizable={false} draggable={false} style={{ width: 'fit-content' }} onHide={() => {if (!openModal) return; setOpenModal(false); }}>
                        <p className="m-0">
                            Do you want to <strong>delete</strong> your account?
                        </p>
                    </Dialog>
                </div>

                {/* <Modal open={openModal} /> */}
              </div>
            </form>
          </motion.div>
      </div>
    </motion.div>
</>
  )
}

export default Profile