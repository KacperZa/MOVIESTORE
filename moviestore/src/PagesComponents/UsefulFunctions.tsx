export const calculateAge = (val:string) => {
  const today = new Date()
  const birth = new Date(val)
  
  let age = today.getFullYear() - birth.getFullYear()
  
  const hadBirthday = today.getMonth() > birth.getMonth() || (today.getMonth()  === birth.getMonth() && today.getDate() >= birth.getDate())
  if(!hadBirthday) age--;
  
  return age
}