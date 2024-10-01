import React, { useEffect, useState } from 'react';
import './App.css';
import Connector from './signalr-connection';
import { fetchTeams, createTeam } from './TeamService'; // Import the service functions
import { createGame, fetchGames, joinGame } from './GameService';
import TeamList from './TeamList';
import GameList from './GameList';

function App() {
  const { newMessage, events } = Connector();
  const [message, setMessage] = useState("initial value");
  const [teams, setTeams] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // State for creating a new team
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamDescription, setNewTeamDescription] = useState<string>('');

  // State for creating a new game
  const [newGameName, setNewGameName] = useState<string>('');
  const [newGameDescription, setNewGameDescription] = useState<string>('');
  const [newGameTeamId, setNewGameTeamId] = useState<string>('');

  // State for joining a game
  const [newTeamId, setNewTeamId] = useState<string>('');
  const [newGameId, setNewGameId] = useState<string>('');

  const [refreshGames, setRefreshGames] = useState(false); // State to trigger game list refresh
  const [refreshTeams, setRefreshTeams] = useState(false); // State to trigger team list refresh

  const [locationUpdates, setLocationUpdates] = useState<{ teamName: string, location: any }[]>([]);
  const [gameUpdates, setGameUpdates] = useState<{ data: any }[]>([]);
  
  useEffect(() => {
    events(
      (event, data) => setMessage(data), // Handle generic messages
  
      // Handle location updates
      (locationUpdate) => {
        try {
          let parsedData;
  
          if (typeof locationUpdate === "string") {
            parsedData = JSON.parse(locationUpdate);
          } else {
            parsedData = locationUpdate;
          }
  
          const { Name: teamName, Location: location } = parsedData;
          setLocationUpdates((prevUpdates) => [
            ...prevUpdates,
            { teamName, location }
          ]);
  
          console.log({ teamName, location });
        } catch (error) {
          console.error("Error handling location update:", error);
        }
      },
  
      // Handle game updates such as teamCreated, teamJoinedGame, etc.
      (gameData) => {
        console.log('Game update received:', gameData); // Log the received game update
  
        // Add the new game update to the state
        setGameUpdates((prevUpdates) => [
          ...prevUpdates,
          { data: gameData } // Store the gameData in the state
        ]);
      },
      
      // Handle game joined updates
      (gameJoinedData) => {
        console.log('Game joined update received:', gameJoinedData); // Log the received game joined update
      }
    );
  }, [events]);
  


  // Create new team
  const handleCreateTeam = async () => {
    setError(null);
    try {
      await createTeam(newTeamName, newTeamDescription);
      setRefreshTeams(prev => !prev);
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Join game
  const handleJoinGame = async () => {
    setError(null);
    try {
      await joinGame(newGameId, newTeamId);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Create game
  const handleCreateGame = async () => {
    setError(null);
    try {
      await createGame(newGameName, newGameDescription, newGameTeamId);
      setRefreshGames(prev => !prev);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <div className="message-container">
        <span className="message-label">Message from SignalR:</span>
        <span className="message-value">{message}</span>
      </div>
      <button className="button" onClick={() => newMessage((new Date()).toISOString())}>
        Send Date
      </button>

      <TeamList refresh={refreshTeams} />
      <GameList refresh={refreshGames} />

      {/* Input fields for creating a new team */}
      <br />
      <h3>Create New Team</h3>
      <input
        type="text"
        placeholder="Team Name"
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Team Description"
        value={newTeamDescription}
        onChange={(e) => setNewTeamDescription(e.target.value)}
      />
      <button onClick={handleCreateTeam}>Create Team</button>

      {/* Input fields for creatuing a game */}
      <br />
      <h3>Create Game</h3>
      <input
        type="text"
        placeholder="Game Name"
        value={newGameName}
        onChange={(e) => setNewGameName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Team ID"
        value={newGameTeamId}
        onChange={(e) => setNewGameTeamId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Game Description"
        value={newGameDescription}
        onChange={(e) => setNewGameDescription(e.target.value)}
      />
      <button onClick={handleCreateGame}>Create Game</button>

      {/* Input fields for joiining a game */}
      <br />
      <h3>Join Game</h3>
      <input
        type="text"
        placeholder="Your Team ID"
        value={newTeamId}
        onChange={(e) => setNewTeamId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Game ID"
        value={newGameId}
        onChange={(e) => setNewGameId(e.target.value)}
      />
      <button onClick={handleJoinGame}>Join Game</button>

      {/* Display Game Updates */}
      <h3>Game Updates</h3>
      <div className="location-panel">
        <ul className="location-list">
          {gameUpdates.slice(0, 30).map((update, index) => (
            <li key={index} className="location-item">
              <strong>Info:</strong> {update.data}
              <br />
            </li>
          ))}
        </ul>
      </div>

      {/* Display Location Updates */}
      <h3>Location Updates</h3>
      <div className="location-panel">
        <ul className="location-list">
          {locationUpdates.slice(0, 30).map((update, index) => (
            <li key={index} className="location-item">
              <strong>Team:</strong> {update.teamName}
              <br />
              <strong>Location (GeoJSON):</strong> {JSON.stringify(update.location, null, 2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;