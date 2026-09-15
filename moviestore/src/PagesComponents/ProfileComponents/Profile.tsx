import { motion } from 'motion/react'
import { useUser } from '../../context/useUser'
import { Button, Group, Modal, NumberInput, PasswordInput, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useField, useForm } from '@mantine/form';

import { AtSignIcon, Calendar, Check, Lock, SquarePen, Trash, User } from 'lucide-react'

import useGetCreationDay from '../../hooks/useGetCreationDay'

import useDeleteUser from '@/hooks/useDeleteUser'
import useEditUser from '@/hooks/useEditUser'
import useFetchWatchedMedia from '@/hooks/useFetchWatchedMedia';
import Chart from '@/ui/Chart';
import { useState } from 'react';
// import { InputText } from 'primereact/inputtext';




function Profile() {
  const [tvType, setTvType] = useState<"Episodes" | "Seasons">('Episodes')

  const { user } = useUser()

  // Mantine hooks
  const [visible, { toggle }] = useDisclosure(false)
  const [opened, {open, close}] = useDisclosure(false)
  const [deleteModalOpened, {open: openDeleteModal, close: closeDeleteModal}] = useDisclosure(false)

  
  const { time, day, month, year } = useGetCreationDay(user?.creationDate ?? null)
    
  const { deleteUser, error } = useDeleteUser()
  
  if(error) console.log('An error occured during deleting user', error)
    
  const { editUser } = useEditUser()
  const { data: watchedMedia } = useFetchWatchedMedia()

  // Filtering watchedMedia for movies that are watched
  const watchedMovieHours = watchedMedia?.filter(media => media.mediaType === "movie")
  .filter(movie => movie.status === "watched")
  .reduce(
    (acc, currentVal) => acc + currentVal.runtime, 0
  )

  // Filtering watchedMedia for movies that are pending
  const pendingMovieHours = watchedMedia?.filter(media => media.mediaType === "movie")
  .filter(movie => movie.status === "pending")
  .reduce(
    (acc, currentVal) => acc + currentVal.runtime, 0
  )

  const filterType = tvType === "Episodes" ? "number_of_episodes" : "number_of_seasons"

  // Filtering watchedMedia for tv shows that are watched
  const watchedShowsSeasons = watchedMedia?.filter(media => media.mediaType === "tv")
  .filter(movie => movie.status === "watched")
  .reduce(
    (acc, currentVal) => acc + currentVal[filterType], 0
  )

  // Filtering watchedMedia for tv shows that are pending
  const pendingShowsSeasons = watchedMedia?.filter(media => media.mediaType === "tv")
  .filter(movie => movie.status === "pending")
  .reduce(
    (acc, currentVal) => acc + currentVal[filterType], 0
  )

  // Data for charts
  const movieData = [
    { name: 'Watched', value: watchedMovieHours },
    { name: 'Still to watch', value: pendingMovieHours }
  ]

  const showData = [
    { name: 'Watched ', value: watchedShowsSeasons},
    { name: 'Still to watch', value: pendingShowsSeasons},
  ]


  // Mantine Field hook
  const usernameField = useField({
    initialValue: '',
    validate: (value: string) => (value.trim().length > 4 ? null : 'Your username have at least 4 characters'),
  })
  const emailField = useField({
    initialValue: '',
    validate: (value: string) => (/^[\w.-]+@[a-z\d.-]+\.[a-z]{2,}$/.test(value) ? null : 'Incorrect e-mail format!'),
  })

  const ageField = useField({
    initialValue: user?.age ?? 0,
    validate: (value: number) => (value >= 6 || value <= 100 ? null : 'I dont think this is your age...')
  })

  // Mantine Form hook
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      secondPassword: ''
    },

    validate: {
      password: (value: string) => (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*().,?":{}|<>_-}]).{9,}$/.test(value) ? null : 'Password must be at least 9 characters and include an uppercase letter, a lowercase letter, a number, and a special character.'),
      secondPassword: (value, values) => value === values.password ? null : `Password don't match!`
    }
  })


  return (
  <>
    <motion.div  className="flex flex-col bg-background border-t border-card rounded-2xl p-2 w-screen max-h-screen justify-center items-center overflow-auto">
      <div className="flex min-w-full h-full flex-col p-3 gap-3">
        <div className='flex flex-row items-center justify-between min-w-full h-fit bg-accent rounded-lg px-4 py-2 font-medium  '>
          <p className='flex font-bold text-5xl py-4'>{user ? user?.username.toUpperCase() : 'Loading'}</p>
          <motion.div 
          onClick={openDeleteModal} 
          className='bg-red-400 flex flex-row gap-1 py-2 px-4 rounded-lg cursor-pointer select-none'
          whileHover={{ scale: 1.02}} 
          whileTap={{ scale: 0.98}}>
            Delete Account
            <Trash />
          </motion.div>
        </div>

        <div className='min-w-full h-fit  bg-accent rounded-lg p-2'>
          <p className='text-4xl font-bold p-2'>PERSONAL INFORMATION</p>
          <div className='flex flex-row gap-5 justify-evenly p-4 font-medium items-center '>
            <p>E-mail: {user?.email}</p>
            <p>Age: {user?.age ?? 'Not specified'}.</p>
            <p>Account created: {day} {month} {year} at {time}.</p>

            <motion.div 
            onClick={open} 
            className='bg-secondary py-2 px-5 rounded-lg font-medium flex flex-row gap-1 justify-center cursor-pointer select-none'
            whileHover={{ scale: 1.03}} 
            whileTap={{ scale: 0.98}}>
              <SquarePen />
              Edit
            </motion.div>

          </div>
        </div>

        <div className='w-full bg-accent rounded-lg p-4 flex flex-col flex-1 min-h-0'>
          <p className='text-4xl font-bold w-full text-center p-5'>Statistics</p>
          <div className='w-full flex flex-row p-5'>

            <div className='w-1/2 h-50 flex flex-col items-center'>
              <p className='text-xl font-semibold p-1'>Movies (hours)</p>
                <Chart data={movieData}/>
            </div>

            <div className='w-1/2 h-50 flex flex-col items-center'>
              <div className='text-xl font-semibold flex flex-row gap-1'>
                <p className='flex items-center'>Tv shows ({tvType.toLowerCase()})</p>
                <motion.button 
                whileHover={{scale: 1.03}}
                whileTap={{scale: 0.98}}
                className='bg-primary rounded-lg px-2 py-1 cursor-pointer' 
                onClick={() => setTvType(prev => prev === "Episodes" ? "Seasons" : "Episodes")}>
                  {tvType === "Episodes" ? "Seasons" : "Episodes"}
                </motion.button>
              </div>
                <Chart data={showData}/>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
    
    <Modal opened={opened} onClose={close} title="Edit" centered size='lg' onClick={(e) => e.stopPropagation()} classNames={{ title: '!px-2 !font-bold !text-2xl'}} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
        }}>
            <Group justify='evenly'>
                <div className="flex flex-col items-center gap-4 w-full p-2 py-4 ">
                  <div className='bg-gray-400 shadow-xl/20 p-3 px-4 rounded-lg min-w-full flex flex-row items-end gap-2'>
                    <TextInput
                    withAsterisk
                    label='Username'
                    placeholder='Johndore1232'
                    leftSection={<User size={16} />}
                    {...usernameField.getInputProps()}
                    className='flex-1'
                    />
                    <Button onClick={async () => {
                      const error = await usernameField.validate()
                        if(!error) {
                          editUser({
                            username: emailField.getValue(), 
                            email: user?.email ?? null, 
                            age: user?.age ?? null, 
                            password: null,
                          })
                            console.log(emailField.getValue())
                        }
                      }}
                      rightSection={<Check size={16}/>} type='submit'> Confirm</Button>
                  </div>
                  <div className="bg-gray-400 shadow-xl/20 p-3 px-4 rounded-lg min-w-full flex flex-row items-end gap-2">
                    <TextInput
                    withAsterisk
                    label='Email'
                    placeholder='John.dore@1232.com'
                    leftSection={<AtSignIcon size={16} />}
                    {...emailField.getInputProps()}
                    className='flex-1'
                    />
                    <Button onClick={async () => {
                      const error = await emailField.validate()
                        if(!error) {
                          editUser({
                            email: emailField.getValue(), 
                            username: user?.username ?? null, 
                            age: user?.age ?? null, 
                            password: null,
                          })
                            console.log(emailField.getValue())
                        }
                      }} 
                      rightSection={<Check size={16}/>} type='button'> Confirm</Button>
                  </div>
                  <div className="bg-gray-400 shadow-xl/20 p-3 px-4 rounded-lg w-full flex flex-row items-end gap-2">
                    <NumberInput
                    withAsterisk 
                    label="Age"
                    placeholder='24'
                    leftSection={<Calendar size={16}/>}
                    {...ageField.getInputProps()}
                    className='flex-1'
                    />
                    <Button onClick={async () => {
                      const error = await ageField.validate()
                        if(!error) {
                          editUser({
                            username: user?.username ?? null , 
                            email: user?.email ?? null, 
                            age: ageField.getValue(), 
                            password: null,
                          })
                            console.log(emailField.getValue())
                        }
                      }} rightSection={<Check size={16}/>} type='submit'> Confirm</Button>
                  </div>

                  <form onSubmit={
                          form.onSubmit((values) => {
                            editUser({
                              username: user?.username ?? null , 
                              email: user?.email ?? null, 
                              age: user?.age ?? null, 
                              password: values.password,
                          }); 
                          form.reset()})
                        } 
                          id="dane" className='flex flex-row items-center w-full bg-gray-400 shadow-xl/20 p-3 px-4 rounded-lg gap-2'>
                    <div className='flex flex-col flex-1 gap-2 w-full '>
                      <PasswordInput
                      withAsterisk 
                      label="Password"
                      placeholder='Password'
                      leftSection={<Lock size={16}/>}
                      visible={visible}
                      onVisibilityChange={toggle}
                      key={form.key('password')}
                      {...form.getInputProps('password')}
                      />
                      <PasswordInput
                      withAsterisk 
                      label="Confirm your Password"
                      placeholder='Password'
                      leftSection={<Lock size={16}/>}
                      visible={visible}
                      onVisibilityChange={toggle}
                      key={form.key('secondPassword')}
                      {...form.getInputProps('secondPassword')}
                      />
                    </div>
                    <Button rightSection={<Check size={16} className=''/>} type='submit'> Confirm</Button>
                  </form> 
              </div>
            </Group>
        </Modal>
        
        {/* Delete account modal */}
        <Modal title="Delete an account" opened={deleteModalOpened} onClose={closeDeleteModal} classNames={{ title: '!font-bold !text-2xl'}} centered>
          <div className='flex flex-col w-full h-full p-2 gap-2 justify-center'>
            <p className='flex p-2 w-full justify-center'>Do you really want to delete an account?</p>
            <div className='flex flex-row gap-2 justify-evenly'>
              <Button className='shadow-lg/20' color='green' onClick={closeDeleteModal}>No, cancel it</Button>
              <Button className='shadow-lg/20' color='red' onClick={deleteUser}>Yes, delete it</Button>
            </div>
          </div>
        </Modal>
</>
  )
}

export default Profile