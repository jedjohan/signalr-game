import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TeamStatus from './TeamStatus';
import TeamChallenge from './TeamChallenge';
import TeamTravel from './TeamTravel';
import { getGameStatus } from '../../services/GameService';
import { GameSessionResponse } from '../../Models/models';
import './TeamApp.css';

const TeamApp: React.FC = () => {
  const { gameSessionId, teamId } = useParams<{ gameSessionId: string; teamId: string }>();
  const [challengeId, setChallengeId] = useState<string | undefined>();

  useEffect(() => {
    const fetchTeamStatus = async () => {
      try {
        if (!gameSessionId || !teamId) return;
        const gameStatus: GameSessionResponse = await getGameStatus(gameSessionId);
        const team = gameStatus.team1?.id === teamId ? gameStatus.team1 : gameStatus.team2;
        if (team?.activeChallengeId) {
          setChallengeId(team.activeChallengeId);
        }
      } catch (err: any) {
        console.error('Error fetching game status:', err.message);
      }
    };
    
    fetchTeamStatus();
  }, [gameSessionId, teamId]);

  return (
    <div className="team-app">
      <div className="left-column">
        <TeamStatus gameSessionId={gameSessionId} teamId={teamId} setChallengeId={setChallengeId} />
      </div>
      <div className="center-column">
        <TeamChallenge gameSessionId={gameSessionId} teamId={teamId} challengeId={challengeId} />
      </div>
      <div className="right-column">
        <TeamTravel gameSessionId={gameSessionId} teamId={teamId} />
      </div>
    </div>
  );
}

export default TeamApp;