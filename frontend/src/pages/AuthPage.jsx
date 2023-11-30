import React, { useEffect, useState } from 'react'
import SignupCard from './SignupCard';
import LoginCard from './LoginCard';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  // If the user is already authenticated, redirect to the home page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user-threads"))) {
      navigate("/");
    }
  })
    
  return (
    <>
    {toggle ? <SignupCard toggle={toggle} setToggle={setToggle} /> : <LoginCard toggle={toggle} setToggle={setToggle} />}
    </>
  )
}

export default AuthPage;