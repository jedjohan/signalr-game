import React, { useEffect, useState } from 'react';
import './App.css';
import Connector from './services/signalr-connection';
import CreateGame from './components/CreateGame';
import CreateDefaultGame from './components/CreateDefaultGame';
import GetGameStatus from './components/GetGameStatus';
import GameUpdates from './components/GameUpdates';
import LocationUpdates from './components/LocationUpdates';
import TeamList from './components/TeamList';
import GameList from './components/GameList';

function App() {
  const { newMessage, events } = Connector();
  const [message, setMessage] = useState('initial value');
  const [refreshGames, setRefreshGames] = useState(false);
  const [locationUpdates, setLocationUpdates] = useState<{ teamName: string; location: any }[]>([]);
  const [gameUpdates, setGameUpdates] = useState<{ data: any }[]>([]);

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

  return (
    <div className="App">
      <div className="message-container">
        <span className="message-label">Message from SignalR:</span>
        <span className="message-value">{message}</span>
      </div>
      <button className="button" onClick={() => newMessage(new Date().toISOString())}>Send Date</button>
      <CreateDefaultGame setRefreshGames={setRefreshGames} />
      <CreateGame setRefreshGames={setRefreshGames} />
      <TeamList refresh={refreshGames} />
      <GameList refresh={refreshGames} />
      <GetGameStatus />
      <GameUpdates gameUpdates={gameUpdates} />
      <LocationUpdates locationUpdates={locationUpdates} />
    </div>
  );
}

export default App;
