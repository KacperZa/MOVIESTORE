import { motion } from 'motion/react'
import React from 'react'

function Profile() {
  return (
    <>

  <>
  <div className="flex flex-col ml-5 g-4 w-full">
    <motion.div layout className="flex flex-8 flex-col bg-blue-400 rounded-2xl p-2 w-screen">
      <div className="flex w-full justify-center items-center">
        <div className='flex flex-col w-1/2 min-w-1/2 justify-center items-center '>
          {/* USERNAME AND PFP */}
          <div className='flex flex-row p-16'>
            KACPER ZAJAC
          </div>
          {/* CONTAINER FOR DATA  */}
          <div className='flex flex-col bg-blue-500 p-7 rounded-2xl ' id='data'>
            <div className='flex flex-row justify-center items-center' id='buttons'>
              <button className='px-5 py-3 bg-blue-600 rounded-xl'> INFORMATION</button>
              <button className='px-5 py-3 bg-blue-600 rounded-xl'> FAVOURITES</button>
            </div>

            {/* CONTAINER FOR DISPLAYING AND CHANGING DATA */}
            <div className="flex flex-row gap-24">
              <div className='flex flex-col gap-11 justify-center items-start'>
                <div className="flex flex-row" id='input'>
                  <label htmlFor="username">Username</label>
                  <input type="text" />
                </div>
                <div className="flex flex-row" id='input'>
                  <label htmlFor="email">Email</label>
                  <input type="email" />
                </div>
                <div className="flex flex-row" id='input'>  
                  <label htmlFor="dateOfBirth">Date of birth</label>
                  <input type="date" />
                </div>
                <div className="flex flex-row" id='input'>
                  <label htmlFor="password">Password</label>
                  <input type="password" />
                </div>  
              </div>

              <div className='flex justify-center items-center' id='edit_button'>
                <button>EDIT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </motion.div>
  </div>
</>
  
    </>
  )
}

export default Profile