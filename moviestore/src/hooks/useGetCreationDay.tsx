import { useEffect, useState } from 'react'

const useGetCreationDay = (userCreationDate : string | null) => {
    const [day, setDay] = useState<number>()
    const [month, setMonth] = useState<string>()
    const [year, setYear] = useState<number>()
    const [time, setTime] = useState<string>()

    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    useEffect(() =>{
        const getCreatingDate = () => {

            if(!userCreationDate) return 
            setTime(userCreationDate.slice(11, -8))

            const creatingDate = new Date(userCreationDate)
            setYear(creatingDate.getFullYear())
            setMonth(months[creatingDate.getMonth()])
            setDay(creatingDate.getDay())
        }
        getCreatingDate()
    },[userCreationDate])
  return {time, day, month, year}
}

export default useGetCreationDay