import { motion } from 'motion/react'
import { useState } from 'react'
import { useUser } from '../../context/useUser'
import { Button, Group, Modal, NumberInput, PasswordInput, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useField, useForm } from '@mantine/form';

import { AtSignIcon, Calendar, Check, Lock, SquarePen, Trash, User } from 'lucide-react'
import useGetCreationDay from '../../hooks/useGetCreationDay'
import useFetchWatchedMedia from '@/hooks/useFetchWatchedMedia'
import useFetchFavouritesIds from '@/hooks/useFetchFavouritesIds'
import FavouriteToggle from '../FavouriteToggle'
import type { MediaWithUser } from '../FavouritesPage'
import MediaCard from '@/ui/MediaCard'
import useDeleteUser from '@/hooks/useDeleteUser'
import useEditUser from '@/hooks/useEditUser'
// import { InputText } from 'primereact/inputtext';




function Profile() {


  const { user } = useUser()

  const [selectedGenre, setSelectedGenre] = useState("movie")
  
  const [visible, { toggle }] = useDisclosure(false)
  const [opened, {open, close}] = useDisclosure(false)
  const [deleteModalOpened, {open: openDeleteModal, close: closeDeleteModal}] = useDisclosure(false)


  const { time, day, month, year } = useGetCreationDay(user?.creationDate ?? null)
  const { isPending: isPendingWatchedMedia, isError, data: watchedFilms, error: errorWatchedMedia } = useFetchWatchedMedia()
  if(isError) console.log('An error occured during fetching favouriteIds', errorWatchedMedia?.message)
  
  const { isError: isErrorIds, data: favouriteIds, error: errorFavouriteIds } = useFetchFavouritesIds(user?._id)
  if(isErrorIds) console.log('An error occured during fetching favouriteIds', errorFavouriteIds?.message)

  const { addFavourite, removeFavourite } = FavouriteToggle()

  const {deleteUser, loading, error} = useDeleteUser()

  const { editUser } = useEditUser()



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

  const sortedMedia = watchedFilms?.filter((media) => media.mediaType === selectedGenre)

  return (
  <>
    <motion.div layout className="flex flex-col bg-background border-t border-card rounded-2xl p-2 w-screen max-h-screen justify-center items-center overflow-auto">
      <div className="flex min-w-full h-full flex-col p-3 gap-3">
        <div className='flex flex-row items-center justify-between min-w-full h-fit bg-secondary rounded-xl p-2 font-medium  '>
          <p className='flex font-bold text-5xl  p-4'>{user ? user?.username.toUpperCase() : 'Loading'}</p>
          <Button color='red' onClick={openDeleteModal} rightSection={<Trash />}> Delete Account</Button>
        </div>

        <div className='min-w-full h-fit  bg-secondary rounded-xl p-2'>
          <p className='text-4xl font-bold p-2'>PERSONAL INFORMATION</p>
          <div className='flex flex-row gap-5 justify-evenly p-4 font-medium items-center '>
            <p>E-mail: {user?.email}</p>
            <p>Age: {user?.age ?? 'Not specified'}.</p>
            <p>Account created: {day} {month} {year} at {time}.</p>
            <Button variant='light' size='sm' leftSection={<SquarePen />} onClick={open} className='bg-gray-400 py-3 px-8 rounded-lg font-medium  shadow-xl/15 shadow-black flex justify-center cursor-pointer'>Edit</Button>
          </div>
        </div>

        <div>
          <div className='text-2xl font-semibold p-3 flex flex-row gap-1 select-none'> Watched 
            <div className='flex flex-row gap-1'>
              <div onClick={() => setSelectedGenre("movie")} className={`cursor-pointer px-1 ${selectedGenre === "movie" ? 'bg-accent rounded-md flex-1' : null} `}>Movies </div>
              / 
              <div onClick={() => setSelectedGenre("tv")} className={`cursor-pointer px-1 ${selectedGenre === "tv" ? 'bg-accent rounded-md flex-1' : null} `}>Tv shows </div>
            </div>
             </div>
             {isPendingWatchedMedia ?
                <div className='grid grid-cols-4 gap-y-5 overflow-auto p-2'>
                  {sortedMedia?.map((media, i) => {
                      return  <MediaCard<MediaWithUser> key={i}  media={media} type={media.type} favouriteIds={favouriteIds ?? new Set()} addFavourite={addFavourite} removeFavourite={removeFavourite}/>
                    })}
                </div>
            :
            <div className='w-full h-full'>

            </div> 
            }
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