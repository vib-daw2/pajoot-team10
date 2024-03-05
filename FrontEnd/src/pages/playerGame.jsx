import React, { useState, useEffect} from 'react';
import useStore from '../store';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';
import PlayerGameOver from '../components/playerGameOver';
import PlayerQuestion from '../components/playerQuestion';
import PlayerTimeUp from '../components/playerTimeUp';
import PlayerLobby from '../components/playerLobby';


const PlayerGame = () => {
  const [GamePhase, setGamePhase] = useState('WaitingForPlayers');
  const {game,setGame} = useStore();
  const navigate = useNavigate();

  useEffect(() => {

    if(!game){

        navigate('/')
        
    }



  },[game])

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


    socket.on('hostStartGame', startGame);
    socket.on('hostTimeUp', timeUp);
    socket.on('hostNextQuestion', nextQuestion);
    socket.on('hostGameOver', gameOver);


  }, []);
  


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