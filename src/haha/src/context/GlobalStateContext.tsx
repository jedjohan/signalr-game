import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalStateContextProps {
  children: ReactNode;
}

interface GameUpdate {
  data: any;
}

interface GlobalState {
  joinedTeamId: string | null;
  setJoinedTeamId: (id: string | null) => void;
  gameUpdates: GameUpdate[];
  setGameUpdates: React.Dispatch<React.SetStateAction<GameUpdate[]>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<GlobalStateContextProps> = ({ children }) => {
  const [joinedTeamId, setJoinedTeamId] = useState<string | null>(null);
  const [gameUpdates, setGameUpdates] = useState<GameUpdate[]>([]);

  return (
    <GlobalStateContext.Provider value={{ joinedTeamId, setJoinedTeamId, gameUpdates, setGameUpdates }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
