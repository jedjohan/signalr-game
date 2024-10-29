import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';

const GameUpdates: React.FC = () => {
  const { gameUpdates } = useGlobalState();

  return (
    <div>
      <h3>Game Updates</h3>
      <div className="gameupdates">
        <ul className="location-list">
          {gameUpdates.slice(0, 30).map((update, index) => (
            <li key={index} className="location-item">
              <strong>Info:</strong> {update.data}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameUpdates;
