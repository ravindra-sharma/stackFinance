import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios";
import socketIOClient from "socket.io-client";
import Login from './login/Login';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function App() {
  const [fetchError, setFetchError] = useState(null);
  const [shares, setShares] = useState([]);
  const [userShares, setUserShares] = useState([]);
  const isLoggedIn = localStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  useEffect(() => {
    console.log("In use effect");
  if(isLoggedIn){
    console.log(loggedIn, "In if condition")
    const socket = socketIOClient('/', {
      query: {token: loggedIn}
    });
    socket.on("share-live", data => {
      setShares(JSON.parse(data));
    });
    socket.on("user-share", data => {
      setUserShares(JSON.parse(data));
    });
  }}, [loggedIn]);
  
  const login = async (username, password) => {
    const { data } = await axios.post(`/users/authenticate`, {username,password});
    localStorage.setItem('token', data.token);
    setLoggedIn(data.token);
  };
/*[{"_id":"5f0b37fae7179a221ee3f397","listed_id":"FCB","user_id":"5f09dc44e7179a221ee3d929","no_of_shares":560,"buy_price":111,"currentTotalPrice":62288.518813324794,"initialTotalPrice":62160},
{"_id":"5f0a1a12e7179a221ee3ddfe","listed_id":"APLH","user_id":"5f09dc44e7179a221ee3d929","no_of_shares":80,"buy_price":148,"currentTotalPrice":10916.168183315327,"initialTotalPrice":11840}]*/ 
  return (
    <>
    {!loggedIn ? (<Login login={login}/>) : (
      <section>
        <table id="shares">
  <tr>
    <th>Company</th>
    <th>Bought Value</th>
    <th>Current Value</th>
    <th>Profit/Loss</th>
  </tr>
  {userShares.map((share, i) => (
            <tr>
              <td>
                {share.listed_id}
              </td>
              <td>
                {share.initialTotalPrice.toFixed(2)}
              </td>
              <td>
                {share.currentTotalPrice.toFixed(2)}
              </td>
              <td>
                {(share.initialTotalPrice.toFixed(2) - share.currentTotalPrice.toFixed(2)).toFixed(2)}
              </td>
            </tr>
          ))}
  </table>
  <table id="shares">
  <tr>
    <th>Company</th>
    <th>Bought Value</th>
    <th>Current Value</th>
    <th>Profit/Loss</th>
  </tr>
  {shares.map((share, i) => (
            <tr>
              <td>
                {share.listed_id}
              </td>
              <td>
                {share.listed_name}
              </td>
              <td>
                {share.baseSharePrice.toFixed(2)}
              </td>
              <td>
              <div>
                < input hint="How many shares you want to buy." disabled/>
                <button onClick={()=>{
                  alert("Functionality was not asked in assignment.")
                }}> Buy</button>
              </div>
              </td>
            </tr>
          ))}
  </table>
        {fetchError && (
          <p style={{ color: 'red' }}>{fetchError}</p>
        )}
      </section>) }
    </>
  );
}

export default App;
