import React, { useState } from 'react';
import HostGameOver from '../components/hostGameOver';
import HostQuestion from '../components/hostQuestion';
import HostTimeUp from '../components/hostTimeUp';
import HostLobby from '../components/hostLobby';

const HostGame = () => {
  const [GamePhase, setGamePhase] = useState('register');

  const renderComponent = () => {
      switch (GamePhase) {
          case 'WaitingForPlayers':
              return <HostLobby />;
          case 'Question':
              return <HostQuestion/>;
          case 'TimeUp':
              return <HostTimeUp/>;
          case 'GameOver':
              return <HostGameOver/>;
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

export default HostGame;