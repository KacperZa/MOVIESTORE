import { Button, Group, Modal } from '@mantine/core';
import type { FilmsWithGenres } from './MediaCard';
import usePostAsWatched from '../hooks/usePostAsWatched';
import { CalendarDays, SquarePlus, Star } from 'lucide-react';

interface ModalProps{
    opened: boolean
    media: FilmsWithGenres
    type: string | undefined
    close: () => void 
}

function LightBox({opened, media, type, close }: ModalProps) {

    const { postAsWatched } = usePostAsWatched({movie: media, type})

  return (
    <>
        <Modal opened={opened} onClose={close} title={type === "tv" ? `${media.name}` : `${media.title}`} centered size='lg' onClick={(e) => e.stopPropagation()} classNames={{ title: '!font-bold'}} overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
        }}>
            <div className=" flex justify-center items-center flex-col gap-4">
                <img className="rounded-l select-none" src={`https://image.tmdb.org/t/p/w1280/${media.backdrop_path}`} alt="" />
                <div className="flex gap-2 flex-col justify-center items-center w-full ">
                    <Group justify='space-evenly'>
                        <Button onClick={() => postAsWatched()} leftSection={<SquarePlus size={14} />}>Add as watched</Button>
                        <div className='flex flex-row gap-1 font-bold'> <Star  color='black' fill='#FFEA00'/>{media.vote_average.toFixed(1)}/10</div>
                    </Group>
                    <div className='flex justify-center gap-2 bg-green-400 p-1 px-3 rounded-lg w-fit font-bold text-white'>
                        Genres: {media.gatunki.map((g:string, i:number) => (<span key={i} className=""> {i === media.gatunki.length - 1 ? g  : g+","}</span>))}
                    </div>
                </div>
                <p className="m-0 rounded-lg"> {media.overview}</p>
                <p className="m-0 rounded-lg flex flex-row gap-1 items-center font-medium"> <CalendarDays />Release Date: {media.release_date}</p>
            </div>
        </Modal>
    </>
  )
}

export default LightBox