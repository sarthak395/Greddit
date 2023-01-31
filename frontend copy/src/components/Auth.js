import React from 'react'
import Signup from './Signup'
import Login from './Login'
import { Location, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Auth = () => {
    let location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
      if(localStorage.getItem("token"))
        navigate("/")
    }, [])
    
    
    if (location.search === "?mode=signup")
        return <Signup />

    else if (location.search === "?mode=login")
        return <Login />

}

export default Auth