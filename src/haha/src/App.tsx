import React, { useEffect, useState } from 'react';
import './App.css';
import Connector from './services/signalr-connection';
import CreateGame from './components/CreateGame';
import GetGameStatus from './components/GetGameStatus';
import GameUpdates from './components/GameUpdates';
import LocationUpdates from './components/LocationUpdates';
import GameList from './components/GameList';
import { GameSessionResponse, sessionStatusMapping } from './Models/models';
import { useGlobalState } from './context/GlobalStateContext';


function App() {
  const { newMessage, events } = Connector();
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
    setJoinedTeamId(teamId || null); // Pass null if teamId is undefined
    console.log(`${teamId} has been joined and global var is now ${joinedTeamId}` );
    if (teamId) {
      window.location.href = `/games/joinedGame`; // Redirect to another React component
    }
  };

  return (
    <div className="App">
      <div className="left-column">
        <div className="message-container">
          <span className="message-label">Message from SignalR:</span>
          <span className="message-value">{message}</span>
        </div>
        <button className="button" onClick={() => newMessage(new Date().toISOString())}>Send Date</button>
        <CreateGame setRefreshGames={setRefreshGames} />
        <GetGameStatus onGameStatusReceived={handleGameStatusReceived} />
      </div>
      <div className="center-column">
        <GameList refresh={refreshGames} onGameSelected={handleGameStatusReceived} />
        {selectedGame && (
          <div>
            <h4>Game Details</h4>
            <p>ID: {selectedGame.id}</p>
            <p>Map ID: {selectedGame.mapId}</p>
            <p>Game Length: {selectedGame.gameLength}</p>
            <p>Game Status: {sessionStatusMapping[selectedGame.sessionStatus]}</p>
            {selectedGame.team1 && (
              <button onClick={() => handleJoinTeam(selectedGame.team1?.teamId)}>
                Join {selectedGame.team1.teamName}
              </button>
            )}
            {selectedGame.team2 && (
              <button onClick={() => handleJoinTeam(selectedGame.team2?.teamId)}>
                Join {selectedGame.team2.teamName}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="right-column">
        <GameUpdates gameUpdates={gameUpdates} />
        <LocationUpdates locationUpdates={locationUpdates} />
      </div>
    </div>
  );
}

export default App;
