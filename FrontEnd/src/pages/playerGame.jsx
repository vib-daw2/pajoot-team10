import React, { useState } from 'react';
import PlayerGameOver from '../components/PlayerGameOver';
import PlayerQuestion from '../components/PlayerQuestion';
import PlayerTimeUp from '../components/PlayerTimeUp';
import PlayerLobby from '../components/PlayerLobby';

const PlayerGame = () => {
  const [GamePhase, setGamePhase] = useState('register');

  const renderComponent = () => {
      switch (GamePhase) {
          case 'WaitingForPlayers':
              return <PlayerLobby />;
          case 'Question':
              return <PlayerQuestion/>;
          case 'TimeUp':
              return <PlayerTimeUp/>;
          case 'GameOver':
              return <PlayerGameOver/>;
          default:
              return null;
      }
  };

  return (
      <div>
          {renderComponent()}
      </div>
  );
};

export default PlayerGame;