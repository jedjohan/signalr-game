import React, { useEffect, useState } from 'react';
import './App.css';
import Connector from './services/signalr-connection';
import CreateGame from './components/CreateGame';
import GetGameStatus from './components/GetGameStatus';
import GameUpdates from './components/GameUpdates';
import LocationUpdates from './components/LocationUpdates';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import TeamDetails from './components/TeamDetails';
import { GameSessionResponse } from './Models/models';
import { useGlobalState } from './context/GlobalStateContext';

interface LocationUpdateData {
  Name: string;
  Location: any;
}

function App() {
  const { events } = Connector
  const [message, setMessage] = useState('initial value');
  const [refreshGames, setRefreshGames] = useState(false);
  const [locationUpdates, setLocationUpdates] = useState<LocationUpdateData[]>([]);
  const { joinedTeamId, setJoinedTeamId, setGameUpdates } = useGlobalState();
  const [selectedGame, setSelectedGame] = useState<GameSessionResponse | null>(null);

  useEffect(() => {
    events(
      (username, message) => {
        setMessage(`${username}: ${message}`);
      },
      (data: any) => {
        try {
          const parsedData: LocationUpdateData = JSON.parse(data);
          setLocationUpdates((prevUpdates) => [...prevUpdates, parsedData]);
        } catch (error) {
          console.error('Error handling location update:', error);
        }
      },
      (gameData) => {
        setGameUpdates((prevUpdates) => [...prevUpdates, { data: gameData }]);
      },
      (gameJoinedData) => {
        setGameUpdates((prevUpdates) => [...prevUpdates, { data: gameJoinedData }]);
        console.log('Game joined update received:', gameJoinedData);
      }
    );
  }, [events, setGameUpdates]);  

  const handleGameStatusReceived = (game: GameSessionResponse) => {
    setSelectedGame(game);
  };

  const handleJoinTeam = (teamId: string) => {
    setJoinedTeamId(teamId);
    console.log(`${teamId} has been joined and global var is now ${joinedTeamId}`);
  };

  return (
    <div className="App">
      <div className="left-column">
        <div className="message-container">
          <span className="message-label">Message from SignalR:</span>
          <span className="message-value">{message}</span>
        </div>
        <GameList refresh={refreshGames} onGameSelected={handleGameStatusReceived} />
        <CreateGame setRefreshGames={setRefreshGames} />
        <GetGameStatus onGameStatusReceived={handleGameStatusReceived} />
      </div>
      <div className="center-column">
        {selectedGame && <GameDetails selectedGame={selectedGame} handleJoinTeam={handleJoinTeam} />}
        <GameUpdates />
      </div>
      <div className="right-column">
        <TeamDetails selectedGame={selectedGame} />
        <LocationUpdates locationUpdates={locationUpdates} />
      </div>
    </div>
  );
}

export default App;
