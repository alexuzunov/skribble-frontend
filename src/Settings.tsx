
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Drawing from './Drawing';
import './Settings.css';

const Settings = () => {
    let history = useHistory();
    let { id } = useParams<{id: string}>();
    const [dictionary, setDictionary] = useState("English");
    const [rounds, setRounds] = useState(3);
    const [drawTime, setDrawTime] = useState(80);
    const REACT_APP_PATH = "http://localhost:3000";
    const SPRING_PATH = "http://localhost:8080";

    const handleStartGameClick = () => {
        fetch(`${SPRING_PATH}/set?id=${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ dictionary: dictionary, drawTime: drawTime, rounds: rounds })})
            .then(() => {
                window.location.replace(REACT_APP_PATH + `/canvas/${id}`)
            }, 
            (error) => {
                console.log(error);
            }) 
    }
    
    const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRounds(parseInt(e.target.value))
    }

    const handleDrawTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDrawTime(parseInt(e.target.value))
    }

    const handleDictionaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDictionary(e.target.value)
    }

    return (
        <div>
            <div className="Settings">
                <div className="settingsBox">
                    <h2>Lobby</h2>
                    <label>
                        Rounds
                        <select name="rounds" id="rounds" onChange={handleRoundChange}>
                            <option value="2">2</option>
                            <option value="3" selected>3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </label>
                    <label>
                        Draw time in seconds
                        <select name="drawTime" id="drawTime" onChange={handleDrawTimeChange}>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                            <option value="60">60</option>
                            <option value="70">70</option>
                            <option value="80" selected>80</option>
                            <option value="90">90</option>
                            <option value="100">100</option>
                            <option value="110">110</option>
                            <option value="120">120</option>
                            <option value="130">130</option>
                            <option value="140">140</option>
                            <option value="150">150</option>
                            <option value="160">160</option>
                            <option value="170">170</option>
                            <option value="180">180</option>
                        </select>
                    </label>
                    <label>
                        Dictionary
                        <select name="dictionary" id="dictionary" onChange={handleDictionaryChange}>
                            <option value="English" selected>English</option>
                            <option value="Bulgarian">Bulgarian</option>
                            <option value="Books">Books (English)</option>
                            <option value="Films">Films (English)</option>
                        </select>
                    </label>
                    <label>
                        Custom Words
                        <br />
                        <textarea name="customWords" placeholder="Type your custom words here separated by a comma."></textarea>
                    </label>
                    <button className="btn startGameButton" onClick={handleStartGameClick}>Start Game</button>
                </div>
            </div>
            <div className="Players">
                
            </div>
        </div>
    );
}

export default Settings;