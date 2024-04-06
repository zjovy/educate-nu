import { useState } from 'react'

import './App.css'
import Student from './components/Student.jsx'
import Teacher from './components/Teacher.jsx'
import Login from './components/Login.jsx'

function App() {

  const [userType, setUserType] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      {!loggedIn && <div>
        <h1 className="text-5xl font-bold text-indigo-200">NUEducation</h1>
        <div className="flex flex-col space-y-4 mt-8">
          <button className="hover:bg-gray-700 text-white py-2 px-4 rounded border border-white"
                  onClick={() => setShowLogin(true)}>
            Get Started
          </button>
          {showLogin && <Login userType={userType} setUserType={setUserType} setShowLogin={setShowLogin} setLoggedIn={setLoggedIn}/>}
        </div>
      </div>}
      {loggedIn && userType === "student" && <Student />}
      {loggedIn && userType === "teacher" && <Teacher />}
    </div>
  )
}

export default App;
