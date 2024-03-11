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
  const {game,setGame,question,setQuestion} = useStore();
  const navigate = useNavigate();

  useEffect(() => {

    if(!game){

        navigate('/')
        
    }



  },[game])

  useEffect(() => {
    function startGame(question) {
        setQuestion(question);
        setGamePhase('Question');
    }

    function timeUp() {
        setGamePhase('TimeUp');
    }

    function nextQuestion(question) {
        setQuestion(question);
        setGamePhase('Question');
    }

    function gameOver() {
        setGamePhase('GameOver');
    }


    socket.on('hostStartGame', (question) => {
        console.log (question);
        startGame(question);
    });
    socket.on('hostTimeUp', timeUp);
    socket.on('hostNextQuestion', (question) => {
        console.log (question);
        nextQuestion(question);
    });
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