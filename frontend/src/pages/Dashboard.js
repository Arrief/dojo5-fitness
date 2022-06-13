import React, { useState } from 'react';

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({
    date: "",
    weight: "",
    calories: "",
    workout: ""
  });

  const [backendData, setBackendData] = useState({
    date: "",
    weight: "",
    calories: "",
    workout: ""
  });

  const handleInfo = (event, category) => {
    setUserData({
      ...userData,
      [category]: event.currentTarget.value,
    });
  }; 

  const handleDetails = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/update" , {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        date: userData.date,
        weight: userData.weight,
        calories: userData.calories,
        workout: userData.workout
      })
    })
    .then((response) => {
      if (response.status === 500) {
        setUserData({ 
          date: "",
          weight: "",
          calories: "",
          workout: ""
        });
      } else if (response.status === 201) {
        setUserData({ 
          date: "",
          weight: "",
          calories: "",
          workout: ""
        })
        return response.json()
      }
    })
    .then((data) => {
      setBackendData({
        date: data.date,
        weight: data.weight,
        calories: data.calories,
        workout: data.workout
      })
      } 
    );
  };

  return(
    <>
      {token && 
      <div>
        <div>
          <h3>Username: Test</h3>
          <h6>date: {backendData.date}</h6>
          <h6>weight: {backendData.weight}</h6>
          <h6>calories: {backendData.calories}</h6>
          <h6>workout: {backendData.workout}</h6>
        </div>
        <form onSubmit={handleDetails}>
          <input 
            type="date" 
            placeholder="date"
            value={userData.date}
            onChange={(event) => handleInfo(event, "date")}
            id="date" 
          />
          <input 
            type="number" 
            placeholder="weight"
            value={userData.weight}
            onChange={(event) => handleInfo(event, "weight")}
            id="weight" 
          />
          <input 
            type="number" 
            placeholder="calories" 
            value={userData.calories}
            onChange={(event) => handleInfo(event, "calories")}
            id="calories" 
          />
          <input 
            type="text" 
            placeholder="workout" 
            value={userData.workout}
            onChange={(event) => handleInfo(event, "workout")}
            id="workout" 
          />
          <button>Submit</button>
        </form>
      </div>
      }
    </>
  );
}

export default Dashboard;
