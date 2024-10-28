import React, { useEffect, useState } from 'react';
import './App.css';
import Connector from './services/signalr-connection';
import CreateGame from './components/CreateGame';
import GetGameStatus from './components/GetGameStatus';
import GameUpdates from './components/GameUpdates';
import LocationUpdates from './components/LocationUpdates';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails'; // Import the new component
import TeamDetails from './components/TeamDetails'; // Import the new component
import { GameSessionResponse } from './Models/models';
import { useGlobalState } from './context/GlobalStateContext';

function App() {
  const { events } = Connector();
  const [message, setMessage] = useState('initial value');
  const [refreshGames, setRefreshGames] = useState(false);
  const [locationUpdates, setLocationUpdates] = useState<{ teamName: string; location: any }[]>([]);
  const [gameUpdates, setGameUpdates] = useState<{ data: any }[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameSessionResponse | null>(null);
  const { joinedTeamId, setJoinedTeamId } = useGlobalState();

  useEffect(() => {
    events(
      (event, data) => setMessage(data),
      (locationUpdate) => {
        try {
          const parsedData = typeof locationUpdate === 'string' ? JSON.parse(locationUpdate) : locationUpdate;
          const { Name: teamName, Location: location } = parsedData;
          setLocationUpdates((prevUpdates) => [...prevUpdates, { teamName, location }]);
        } catch (error) {
          console.error('Error handling location update:', error);
        }
      },
      (gameData) => {
        console.log('Game update received:', gameData);
        setGameUpdates((prevUpdates) => [...prevUpdates, { data: gameData }]);
      },
      (gameJoinedData) => {
        console.log('Game joined update received:', gameJoinedData);
      }
    );
  }, [events]);

  const handleGameStatusReceived = (game: GameSessionResponse) => {
    setSelectedGame(game);
  };

  const handleJoinTeam = (teamId: string | undefined) => {
    setJoinedTeamId(teamId || null);
    console.log(`${teamId} has been joined and global var is now ${joinedTeamId}`);
    if (teamId) {
      window.location.href = '/games/joinedGame';
    }
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
        <GameUpdates gameUpdates={gameUpdates} />
      </div>
      <div className="right-column">
        <TeamDetails selectedGame={selectedGame} />
        <LocationUpdates locationUpdates={locationUpdates} />
      </div>
    </div>
  );
}

export default App;
