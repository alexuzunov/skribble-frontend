import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import './Home.css';

const Home = () => {
    const SPRING_PATH = "http://localhost:8080";
    const REACT_APP_PATH = "http://localhost:3000";
    const [host, setHost] = useState("");
    let history = useHistory();

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        setHost(e.currentTarget.value)
    }

    const handlePrivateRoomClick = () => {
        const activeElement = document.activeElement;
        if (activeElement) {
            if (activeElement.className === "btn privateRoomsButton") {
                fetch(`${SPRING_PATH}/create`, { method: 'POST', body: host })
                    .then(response => response.text())
                    .then((result) => {
                        window.location.replace(REACT_APP_PATH + `/room/${result}`)
                    }, 
                    (error) => {
                        console.log(error);
                    }) 
            } 
        } 
    }

    return (
        <div className="Home">
            <img src="https://skribbl.io/res/logo.gif"></img>
            <form className="homeBox">
                <input className="nameInput" type="text" name="name" placeholder="Enter your name" onChange={handleChange} required/>
                <button className="btn publicRoomsButton" type="submit">Play!</button>
                <button className="btn privateRoomsButton" type="button" onClick={handlePrivateRoomClick}>Create Private Room</button>
            </form>
        </div>
    );
}

export default Home;