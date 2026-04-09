import { Route, Routes } from 'react-router-dom'
import './App.css'
import Menu from './components/Menu'
import HomePage from './PagesComponents/HomePage'
import BrowsePage from './PagesComponents/BrowsePage'

function App() {

  return (
  <>
    <Menu>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/browse" element={<BrowsePage/>}></Route>
      </Routes>
    </Menu>
  </>
)
}

export default App
