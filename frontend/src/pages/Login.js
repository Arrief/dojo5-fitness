import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // function to assign the input data to loginData object values
  const handleInfo = (event, category) => {
    setLoginData({
      ...loginData,
      [category]: event.currentTarget.value,
    });
  }; 

  // sending login data to the backend
  const handleLogin = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/login" , {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password
      })
    })
    .then((response) => {
      if (response.status === 500) {
        setLoginData({ 
          email: "",
          password: ""
        });
      }  
      return response.json()
    })
    .then((data) => {
      // placing jwt from backend in the local storage
      localStorage.setItem("token", data.token);
      // redirect user to their profile
      navigate("/dashboard");
  });
  }

  return(
    <>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="email"
          value={loginData.email}
          onChange={(event) => handleInfo(event, "email")}
          id="email"
        />
        <input 
        type="password" 
        placeholder="password" 
        value={loginData.password}
        onChange={(event) => handleInfo(event, "password")}
        id="password"
        />
        <button>Submit</button>
      </form>
    </>
  );
}

export default Login;
