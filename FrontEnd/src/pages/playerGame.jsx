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
  const {game,setGame,question,setQuestion,userLogged,setUserLogge,answeredCorrectly,setAnsweredCorrectly,racha,setRacha,mensajeRacha,setMensajeRacha} = useStore();
  const navigate = useNavigate();

  useEffect(() => {

    if(!game){

        navigate('/')
        
    }



  },[])

  useEffect(() => {
    function startGame(question) {
        setQuestion(question);
        setGamePhase('Question');
    }

    function timeUp(game) {
        setGame(game);
        setGamePhase('TimeUp');
    }

    function nextQuestion(question) {
        setQuestion(question);
        setGamePhase('Question');
        setAnsweredCorrectly(false);
        setMensajeRacha('');
    }

    function gameOver(game) {
        setGame(game);
        setGamePhase('GameOver');
    }


    socket.on('hostStartGame', (question) => {
        console.log (question);
        startGame(question);
    });
    socket.on('hostTimeUp', (game) => {
        timeUp(game);
    });
    socket.on('hostNextQuestion', (question) => {
        console.log (question);
        nextQuestion(question);
    });
    socket.on('hostGameOver', (game) => {
        gameOver(game);
    }
    );


  }, [GamePhase]);
  


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