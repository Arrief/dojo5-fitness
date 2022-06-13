import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleInfo = (event, category) => {
    setLoginData({
      ...loginData,
      [category]: event.currentTarget.value,
    });
  }; 

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
      localStorage.setItem("token", data.token)
      const token = localStorage.getItem("token");
      // redirect user to their profile
      navigate("/dashboard");
  });
  }

  return(
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
  );
}

export default Login;
