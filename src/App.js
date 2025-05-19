import React from "react"
import { Dashboard } from "./components/layout"
import LoginPage from "./components/layoutLogin"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from './pages/users/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<LoginPage/>}/>
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  
    
  )
}

export default App
