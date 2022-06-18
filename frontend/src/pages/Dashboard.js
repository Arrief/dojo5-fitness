import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // getting the jwt from local storage
  const token = localStorage.getItem("token");

  // template for initial user data & to empty input fields
  const emptyData = {
    username: "",
    date: "",
    weight: "",
    calories: "",
    workout: ""
  }

  let [userData, setUserData] = useState(emptyData);

  // state just for updates from input field, separate from user data that is displayed on top of the page
  let [updateData, setUpdateData] = useState({
    date: "",
    weight: "",
    calories: "",
    workout: ""
  });

  // state for triggering a new fetch request after user updates their data
  let [update, setUpdate] = useState(false);

  // useEffect sending the jwt to the backend to verify and receive user data from db if token is correct
  useEffect(() => {
    fetch("http://localhost:5000/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.json())
    .then((data) => setUserData(data));
  }, [update])

  // function to assign the input data to userData object values
  const handleInfo = (event, category) => {
    setUpdateData({
      ...updateData,
      [category]: event.currentTarget.value,
    });
  }; 

  // function to send userData values to backend when user submits form
  const handleDetails = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/update", {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      // name will always be the same from userData, everything else comes from input fields
      body: JSON.stringify({
        username: userData.username,
        date: updateData.date,
        weight: updateData.weight,
        calories: updateData.calories,
        workout: updateData.workout
      })
    })
    .then((response) => {
      // clear the input fields in any case
      setUpdateData(emptyData);
      if (response.status === 500) {
        console.error("An error happened, could not update user data.");
      } else if (response.status === 201) {
        // change the update state to trigger a new fetch with updated data
        setUpdate(!update);
        console.log("updated user successfully.");
      }
    })
  };

  return(
    <>
      <h3>Dashboard</h3>
      {token && 
      <div>
        <div>
          <h3>Username: {userData.username}</h3>
          <h6>date: {userData.date}</h6>
          <h6>weight: {userData.weight}</h6>
          <h6>calories: {userData.calories}</h6>
          <h6>workout: {userData.workout}</h6>
        </div>
        <form onSubmit={handleDetails}>
          <input 
            type="date" 
            placeholder="date"
            value={updateData.date}
            onChange={(event) => handleInfo(event, "date")}
            id="date" 
          />
          <input 
            type="number" 
            placeholder="weight"
            value={updateData.weight}
            onChange={(event) => handleInfo(event, "weight")}
            id="weight" 
          />
          <input 
            type="number" 
            placeholder="calories" 
            value={updateData.calories}
            onChange={(event) => handleInfo(event, "calories")}
            id="calories" 
          />
          <input 
            type="text" 
            placeholder="workout" 
            value={updateData.workout}
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
