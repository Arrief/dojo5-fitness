import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    email: "",
    password: ""
  });

  // function to assign the input data to registerData object values
  const handleInfo = (event, category) => {
    setRegisterData({
      ...registerData,
      [category]: event.currentTarget.value,
    });
  }; 

  // sending register data to the backend
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
        // redirecting user to home, here = login
        navigate("/");
      } 
    });
  };

  return(
    <>
    <h3>Register</h3>
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
    </>
  );
}

export default Register;
