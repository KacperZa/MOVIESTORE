import { Route, Routes } from 'react-router-dom'
import './App.css'
import BrowsePage from './PagesComponents/BrowsePage'
import { MovieGenreContext } from './context/MovieGenreContext'
import { TvGenreContext } from './context/TvMovieGenreContext'
import { UserProvider }  from './context/UserContext'
import SpecificGenre from './PagesComponents/SpecificGenre'
import Login from './PagesComponents/ProfileComponents/Login'
import Register from './PagesComponents/ProfileComponents/Register'
import Profile from './PagesComponents/ProfileComponents/Profile'
import WatchedFilms from './PagesComponents/WatchedFilms'
import FavouritesPage from './PagesComponents/FavouritesPage'

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import HomePage from './PagesComponents/HomePageComponents/HomePage'
import Menu from './MenuComponents/Menu'
import { ThemeProvider } from './context/ThemeContext'
import ThemeApplier from './PagesComponents/ThemeApplier'
import SearchPage from './PagesComponents/SearchPage'
import MovieDetailPage from './PagesComponents/MovieDetailPage'
import TvDetailPage from './PagesComponents/TvDetailPage'

import useFetchGenres from './hooks/useFetchGenres'


function App() {



  // Fetching data for genres and saving it in context 
  const { data: tvGenres, isPending: isPendingTvGenres, isError: isErrorTVGenres, error: errorTvGenres} = useFetchGenres({type:"tv"})

  if(isErrorTVGenres) console.log('An error occured during fetching tvGenres', errorTvGenres?.message)
  const { data: movieGenres, isPending: isPendingMovieGenres, isError: isErrorMovieGenres, error: errorMovieGenres} = useFetchGenres({type:"movie"})

  if(isErrorMovieGenres) console.log('An error occured during fetching MovieGenres', errorMovieGenres?.message)

  return (
  <>
      {/* Mantine UI Provider */}
      <MantineProvider>
        {/* Theme context's Provider and Applier  */}
        <ThemeProvider>
          <ThemeApplier />
          {/* User context's Provider  */}
            <UserProvider>
              {/* Genres context's Providers  */}
              <TvGenreContext.Provider value={tvGenres}>
                <MovieGenreContext.Provider value={movieGenres}>
                  <Routes>
                    <Route element={<Menu />}>
                      <Route path="/" element={<HomePage />}></Route>
                      <Route path="/detail/movie/:id" element={<MovieDetailPage />}></Route>
                      <Route path="/detail/tv/:id" element={<TvDetailPage />}></Route>
                      <Route path="/search" element={<SearchPage />}></Route>
                      <Route path="/browse/:type" element={<BrowsePage />}></Route>
                      <Route path='/favourites' element={<FavouritesPage />}></Route>
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
        </ThemeProvider>
      </MantineProvider>
  </>
)
}

export default App
