import Poster from '.././img/plakat.jpg'
import '.././App.css'
// import { motion } from 'motion/react'
import { motion } from 'motion/react'

function App() {

  
  return (
  <>

    {/* MAIN PANEL  */}
    <div className="flex flex-col flex-6 content-center items-center gap-16 ml-5 rounded-2xl bg-gray-400 p-6">
      <input className="w-4xl h-12 px-4 py-2 rounded-lg border-gray-300 bg-gray-300" type="text" name="" id="" placeholder='Szukaj filmów...' />
      <div className="flex flex-row gap-16 items-center">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21.3333L10.6667 16M10.6667 16L16 10.6667M10.6667 16L21.3333 16M2.66668 16C2.66668 23.3638 8.63621 29.3333 16 29.3333C23.3638 29.3333 29.3333 23.3638 29.3333 16C29.3333 8.63621 23.3638 2.66667 16 2.66667C8.63621 2.66667 2.66668 8.63621 2.66668 16Z" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        {/* OBRAZEK */}
        <motion.div className="relative h-fit"
        initial="hidden"
        whileHover="visible"
        >
          <img src={Poster} alt="" className='rounded-xl w-full h-full' />
          <motion.div className="absolute inset-0 flex px-7 py-10 gap-2 justify-end flex-col text-white"
              variants={{
                hidden: { opacity: 0, y: 10},
                visible: { opacity: 1, y: 0}
              }}
              transition={{ duration: 0.3}}>
              <div className='text-3xl font-bold'>REVERSION</div>
              <div className='flex gap-2 flex-col'>
                <div className='flex flex-row gap-2 text-'> 
                  <div>85% Rating</div>
                  <div>3 Seasons</div>
                </div>
                <button className="w-20 h-9 rounded-2xl bg-red-500 cursor-pointer shadow-lg shadow-red-500/50 select-none">Watch</button>
              </div>
          </motion.div>
          
        </motion.div>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21.3333L21.3333 16M21.3333 16L16 10.6667M21.3333 16L10.6666 16M29.3333 16C29.3333 23.3638 23.3638 29.3333 16 29.3333C8.63616 29.3333 2.66663 23.3638 2.66663 16C2.66663 8.63621 8.63616 2.66667 16 2.66667C23.3638 2.66667 29.3333 8.63621 29.3333 16Z" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

      </div>
      <div className="flex flex-col gap-5 font-bold text-2xl">
        <p>Popularne</p>
        <div className="flex flex-row gap-11">
          <img className="w-56 h-40 rounded-lg" src={Poster} alt="" />
          <img className="w-56 h-40 rounded-lg" src={Poster} alt="" />
          <img className="w-56 h-40 rounded-lg" src={Poster} alt="" />
          <img className="w-56 h-40 rounded-lg" src={Poster} alt="" />
        </div>
      </div>
    </div>
      </>
)
}

export default App
