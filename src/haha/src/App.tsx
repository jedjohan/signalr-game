import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Connector from './services/signalr-connection';
import CreateGame from './components/mainappcomponents/CreateGame';
import GetGameStatus from './components/mainappcomponents/GetGameStatus';
import GameUpdates from './components/mainappcomponents/GameUpdates';
import LocationUpdates from './components/mainappcomponents/LocationUpdates';
import GameList from './components/mainappcomponents/GameList';
import GameDetails from './components/mainappcomponents/GameDetails';
import TeamOverview from './components/mainappcomponents/TeamOverview';
import TeamApp from './components/teamcomponents/TeamApp';
import { GameSessionResponse } from './Models/models';
import { useGlobalState } from './context/GlobalStateContext';

interface LocationUpdateData {
  Name: string;
  Location: any;
}

function App() {
  const { events } = Connector;
  const [message, setMessage] = useState('Trying to connect');
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div className="app-content">
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
                <TeamOverview selectedGame={selectedGame} />
                <LocationUpdates locationUpdates={locationUpdates} />
              </div>
            </div>
          }/>
          <Route path="/games/:gameSessionId/team/:teamId" element={<TeamApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;