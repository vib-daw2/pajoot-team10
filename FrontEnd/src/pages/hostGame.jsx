import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import HostGameOver from '../components/hostGameOver';
import HostQuestion from '../components/hostQuestion';
import HostTimeUp from '../components/hostTimeUp';
import HostLobby from '../components/hostLobby';
import useStore from '../store';
import { socket } from '../socket';

const HostGame = () => {

  const [GamePhase, setGamePhase] = useState('WaitingForPlayers');
  const { game, setGame, question, setQuestion} = useStore();
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


    socket.on('startGame', (question) => {
        console.log (question);
        startGame(question);
    });

    socket.on('timeUp', timeUp);
    
    socket.on('nextQuestion', (question) => {
        console.log (question);
        nextQuestion(question);
    });
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