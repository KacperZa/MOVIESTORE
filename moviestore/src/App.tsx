import { Route, Routes } from 'react-router-dom'
import './App.css'
import Menu from './components/Menu/Menu'
import HomePage from './PagesComponents/HomePage'
import BrowsePage from './PagesComponents/BrowsePage'
import { useEffect, useState } from 'react'
import { MovieGenreContext } from './context/MovieGenreContext'
import { TvGenreContext } from './context/TvMovieGenreContext'
import { UserProvider }  from './context/UserContext'
import SpecificGenre from './PagesComponents/SpecificGenre'
import Login from './PagesComponents/ProfileComponents/Login'
import Register from './PagesComponents/ProfileComponents/Register'
import Profile from './PagesComponents/ProfileComponents/Profile'
import { PrimeReactProvider } from 'primereact/api';
import Favourites from './PagesComponents/Favourites'
import WatchedFilms from './PagesComponents/WatchedFilms'
        


function App() {


  const [genre, setGenre] = useState(null);
  const [tvGenre, setTvGenre] = useState(null);
  // const [loading, setLoading] = useState(true);


  // Fetching data for movies genres and saving it in context 
  useEffect(() =>{
    fetch("/api/movie/genres")
    .then(r => r.json())
    .then(data => {
      setGenre(data)
      // setLoading(false)
    })

    const fetchTvGenres = async () => {
      try{
        const resTv = await fetch("/api/tv/genres")
  
        if(!resTv.ok){
          throw new Error(`HTTP: ${resTv.status}`)
        }
        const data = await resTv.json()
        setTvGenre(data)

      } catch(err) {
        console.error(`Error while fetching tv genres: `, err)
      }
        
    }
    fetchTvGenres()
  },[])

  // bg-[#141414] TŁO
  // bg-gray-700 PANELE
  return (
  <>
    <PrimeReactProvider>
      <UserProvider>
        <TvGenreContext.Provider value={tvGenre}>
          <MovieGenreContext.Provider value={genre}>
            <Routes>
              <Route element={<Menu />}>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/browse/:type" element={<BrowsePage />}></Route>
                <Route path='/favourites' element={<Favourites />}></Route>
                <Route path='/watch-history' element={<WatchedFilms />}></Route>
                <Route path='/:type/genre/:id_genre/:name_genre' element={<SpecificGenre />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
              </Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
            </Routes>
          </MovieGenreContext.Provider>
        </TvGenreContext.Provider>
      </UserProvider>
    </PrimeReactProvider>
  </>
)
}

export default App
