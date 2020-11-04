import React, {useEffect, useState, useContext} from "react";
import {useHistory} from "react-router-dom";
import Navbar from "../../../Navbar";
import Button from "../../../Button";
import Tutorial from "../../Tutorial";
import userContext from "../../../../Context/userContext"
import tutorialContext from "../../../../Context/tutorialContext";
import Leaderboard from "../../Lobby/Leaderboard";
import UserHistory from "../../Lobby/UserHistory";
import "../../Tutorial.scss"; //=> conflict with App.scss
import axios from 'axios';

function Pregame(props) {

  //let tutorialOpen = false;
  const [tutorialActive, setTutorialActive] = useState(false)

  const {user, setUser} = useContext(userContext)
  
  const history = useHistory()
  const handleLogout = () => {
    axios.post("/logout", {}, { withCredentials: true })
      .then((res) => {
        setUser({
          ...user,
          isLoggedIn: false,
          user: {}
        })
        history.push('/')
      })
  }
  
    function expandTutorial(){
        setTutorialActive(!tutorialActive);

      }
  //insert tutorial here
  return (

    <tutorialContext.Provider value={{tutorialActive, setTutorialActive}}>
    <div className="animate-in pre-game">
    <Navbar  user={user.user} logout={handleLogout} /> 
      <div class="lines">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
          
      </div> 
      
      <div className="instructions">
        <h1>CLICK START TO PLAY WHEN YOU ARE READY</h1>
        <Button id="ready-btn" onClick={() => props.onReady()}>I'm ready!</Button>
      </div>

      <div className="tutorial">
        <Button id="tutorial-btn" onClick={() => expandTutorial()}>Tutorial</Button>
      <Tutorial />
      </div>

    </div>
    </tutorialContext.Provider>

  )

}

export default Pregame;