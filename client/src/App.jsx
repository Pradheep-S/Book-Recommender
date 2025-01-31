import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import About from './About'
import Profile from './Profile'
import Yourlist from './Yourlist'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/yourlist' element={<Yourlist />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
