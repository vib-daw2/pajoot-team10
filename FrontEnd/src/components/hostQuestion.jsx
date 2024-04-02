import React, { useState, useEffect, useRef} from 'react';
import { socket } from '../socket';
import Countdown from 'react-countdown';
import useStore from '../store';
import Questionsound from '../../public/assets/sounds/question-groovy-30.mp3';

const HostQuestion = () => {

  const [targetDate, setTargetDate] = useState(Date.now() + 32000);
  const { game, setGame, question, setQuestion} = useStore();
  const audioRef = useRef(false);
  const formatTime = ({ minutes, seconds }) => {
    // Puedes personalizar el formato según tus necesidades
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

useEffect(() => {

  socket.on('updatePlayersAnswered', (game) => {
      setGame(game);
  }
  );
  setTargetDate(Date.now() + 32000);

},[])

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.play();
  }
}, [audioRef]);
   
  return (
    <div className='question-container'>
      <audio id='lobby-music' src={Questionsound} autoPlay ref={audioRef} />
        <div className="form-verify_countdown">
          <h1><Countdown date={targetDate} renderer={({ minutes, seconds }) => formatTime({ minutes, seconds })} onComplete={() => socket.emit('timeUp',JSON.stringify({pin: game.pin}))}/></h1>
        </div>
        <div className='question-content'>
          <p>{question.pregunta}</p>
        </div>
        {game.remoteMode &&(
        <div className='question-buttons'>
          <button className='question-button'><p>A)</p>{question.opciones.a}</button>
          <button className='question-button'><p>B)</p>{question.opciones.b}</button>
          <button className='question-button'><p>C)</p>{question.opciones.c}</button>
          <button className='question-button'><p>D)</p>{question.opciones.d}</button>
        </div>
        )}
        <button className='question-button_next' onClick={() => socket.emit('timeUp',JSON.stringify({pin: game.pin}))}>Finalizar Tiempo</button>
        <div className='question-answered'>
          <p>Han contestado</p><h1 className='question-players'> {game.gameData.playersAnswered} / {game.gameData.players.players.length}</h1><p>jugadores</p>
        </div>
    </div>
  );
};

export default HostQuestion;