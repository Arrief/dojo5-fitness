import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleInfo = (event, category) => {
    setRegisterData({
      ...registerData,
      [category]: event.currentTarget.value,
    });
  }; 

  const handleRegister = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/register" , {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: registerData.email,
        password: registerData.password
      })
    })
    .then((response) => {
      if (response.status === 500) {
        setRegisterData({ 
          email: "",
          password: ""
        });
      } else if (response.status === 201) {
        setRegisterData({
          email: "",
          password: ""
        })
        navigate("/");
      } 
    });
  };

  return(
    <form onSubmit={handleRegister}>
      <input 
        type="email" 
        placeholder="email"
        value={registerData.email}
        onChange={(event) => handleInfo(event, "email")}
        id="email"
      />
      <input 
        type="password" 
        placeholder="password" 
        value={registerData.password}
        onChange={(event) => handleInfo(event, "password")}
        id="password"
      />
      <button>Submit</button>
    </form>
  );
}

export default Register;
