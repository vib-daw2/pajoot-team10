import React, { useState, useEffect} from 'react';
import HostGameOver from '../components/hostGameOver';
import HostQuestion from '../components/hostQuestion';
import HostTimeUp from '../components/hostTimeUp';
import HostLobby from '../components/hostLobby';
import { socket } from '../socket';

const HostGame = () => {
  const [GamePhase, setGamePhase] = useState('WaitingForPlayers');

  useEffect(() => {
    function startGame() {
      setGamePhase('Question');
    }

    function timeUp() {
        setGamePhase('TimeUp');
    }

    function nextQuestion() {
        setGamePhase('Question');
    }

    function gameOver() {
        setGamePhase('GameOver');
    }


    socket.on('startGame', startGame);
    socket.on('timeUp', timeUp);
    socket.on('nextQuestion', nextQuestion);
    socket.on('gameOver', gameOver);


  }, []);


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