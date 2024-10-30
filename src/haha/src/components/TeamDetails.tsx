import React from 'react';
import { GameSessionResponse } from '../Models/models';
import './TeamDetails.css'; // Import the CSS file

interface TeamDetailsProps {
  selectedGame: GameSessionResponse | null;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ selectedGame }) => {
  if (!selectedGame) return null;

  const formatBoolean = (value: boolean | undefined) => (value ? "Yes" : "No");

  return (
    <div className="team-details">
      <h4>Team Details</h4>
      <div className="team">
        <h5>Team 1</h5>
        <p>Team Name: {selectedGame.team1?.teamName}</p>
        <p>Team Score: {selectedGame.team1?.teamScore}</p>
        <p>Team Points: {selectedGame.team1?.points}</p>
        <p>Team Captain selected: {formatBoolean(selectedGame.team1?.captainSelected)}</p>
        <p>Team can travel?: {formatBoolean(selectedGame.team1?.teamCanTravel)}</p>
        <p>Team is ready to start game?: {formatBoolean(selectedGame.team1?.teamIsReadyToStart)}</p>
        <p>Connected devices: {selectedGame.team1?.connectionIds?.join(', ')}</p>
        {/* Add more details as needed */}
      </div>
      <div className="team">
        <h5>Team 2</h5>
        <p>Team Name: {selectedGame.team2?.teamName}</p>
        <p>Team Score: {selectedGame.team2?.teamScore}</p>
        <p>Team Points: {selectedGame.team2?.points}</p>
        <p>Team Captain selected: {formatBoolean(selectedGame.team2?.captainSelected)}</p>
        <p>Team can travel?: {formatBoolean(selectedGame.team2?.teamCanTravel)}</p>
        <p>Team is ready to start game?: {formatBoolean(selectedGame.team2?.teamIsReadyToStart)}</p>
        <p>Connected devices: {selectedGame.team2?.connectionIds?.join(', ')}</p>
      </div>
    </div>
  );
}

export default TeamDetails;