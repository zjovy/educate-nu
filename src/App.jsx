import { useState } from 'react'

import Student from './components/Student.jsx'
import Teacher from './components/Teacher.jsx'
import Login from './components/Login.jsx'

function App() {

  const [userType, setUserType] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div> 
      {!loggedIn && <div className="bg-ghost-white min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold blue-to-white-gradient-text">Educate NU</h1>
        <div className="flex flex-col space-y-4 mt-8">
          <button className="bg-gradient-to-r from-blue-600 to-blue-300 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out"
                  onClick={() => setShowLogin(true)}>
            GET STARTED
            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L13.586 10l-4.293 4.293a1 1 0 000 1.414z"></path></svg>
          </button>
          {showLogin && <Login userType={userType} setUserType={setUserType} setShowLogin={setShowLogin} setLoggedIn={setLoggedIn}/>}
        </div>
      </div>}
      {loggedIn && <div className="bg-ghost-white min-h-screen flex flex-col">
        {userType === "student" && <Student />}
        {userType === "teacher" && <Teacher />}
      </div>}
    </div>
  )
}

export default App;
