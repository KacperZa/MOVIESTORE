import React from 'react'

interface ModalProps{
    open: boolean
}

function Modal({open}: ModalProps) {
if (!open) return null

  return (
    <>
    <div id="ModalBackground" className='w-screen h-screen flex justify-center items-center'>
        <div id="ModalContainer" className='w-4/10 h-2/10 bg-white flex'>
            <button type="button" onClick={() => }> X </button>
            <div>Are you sure you want to delete your account?</div>
            <div className='flex flex-row'>
                <button>No, I dont want.</button>
                <button>Yes, delete It.</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Modal