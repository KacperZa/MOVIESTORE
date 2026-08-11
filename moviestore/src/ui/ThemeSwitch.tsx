import { useTheme } from '@/context/useTheme'
import { motion, type Variants } from 'motion/react'


const ThemeSwitch = () => {

    // Sun Variants 
    const raysVariants = {
    hidden: {
      strokeOpacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      strokeOpacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rayVariant: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      scale: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        pathLength: { duration: 0.3 },
        opacity: { duration: 0.1},
        scale: { duration: 0.3},
      },
    },
  }

//   Moon shine variant 
  const shineVariant: Variants = {
    hidden: {
      opacity: 0,
      scale: 2,
      strokeDasharray: "20, 1000",
      strokeDashoffset: 0,
      filter: "blur(0px)",
    },
    visible: {
      opacity: [0, 1, 0],
      strokeDasharray: [0, -50, -100],
      filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
      transition: {
        duration: 0.75,
      }
    }
  }

  const moonPath = "M21 29C25.4183 29 29 25.4183 29 21C21.2985 23.3174 17.6652 19.7905 21 13C16.5817 13 13 16.5817 13 21C13 25.4183 16.5817 29 21 29Z";
  const sunPath = "M21 29C25.4183 29 29 25.4183 29 21C29 16.5817 25.4183 13 21 13C16.5817 13 13 16.5817 13 21C13 25.4183 16.5817 29 21 29Z"


    const { theme, setTheme} = useTheme()

  return (
    <div className="px-3 pt-1.5 pb-2 flex justify-center bg-card rounded-lg cursor-pointer" 
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <motion.svg 
        width="42" 
        height="42" 
        viewBox="0 0 42 42" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none"
        className="relative">

        <motion.path variants={shineVariant} d={moonPath} className={'absolute top-0 left-0 stroke-blue-100'} initial="hidden" animate={theme === 'dark' ? 'visible' : 'hidden'}>

        </motion.path>

        <motion.path initial={{fillOpacity: 0, strokeOpacity: 0}} 
        animate={theme === "dark" ? {
            fillOpacity: 0.35,
            strokeOpacity: 1,
            strokeWidth: 1.5,
            rotate: 360,
            scale: 2,
            stroke: "var(--color-blue-400)",
            fill: "var(--color-blue-400)",
            d: moonPath
        } : {
            fillOpacity: 0.35,
            strokeOpacity: 1,
            strokeWidth: 3,
            rotate: 0,
            stroke: "var(--color-yellow-400)",
            fill: "var(--color-yellow-400)",
            d: sunPath
        }}
        />

            <motion.g  variants={raysVariants} initial="hidden" animate={theme === "light" ? "visible" : "hidden"} className="stroke-3 stroke-yellow-500 origin-center">
            <motion.path variants={rayVariant} d="M21 5V1" />   
            <motion.path variants={rayVariant} d="M32 10L35 7" /> 
            <motion.path variants={rayVariant} d="M37 21H41" />  
            <motion.path variants={rayVariant} d="M32 32L35 35" /> 
            <motion.path variants={rayVariant} d="M21 37V41" />  
            <motion.path variants={rayVariant} d="M10 32L7 35" /> 
            <motion.path variants={rayVariant} d="M5 21H1" />   
            <motion.path variants={rayVariant} d="M10 10L7 7" /> 
            </motion.g>
        </motion.svg>
    </div>
  )
}

export default ThemeSwitch