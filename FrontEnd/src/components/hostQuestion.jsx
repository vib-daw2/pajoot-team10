import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Countdown from 'react-countdown';
import useStore from '../store';

const HostQuestion = () => {

  const [targetDate, setTargetDate] = useState(Date.now() + 30000);
  const { game, setGame, question, setQuestion} = useStore();
  const formatTime = ({ minutes, seconds }) => {
    // Puedes personalizar el formato según tus necesidades
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

useEffect(() => {

  console.log('reset timer');
  setTargetDate(Date.now() + 30000);

},[])
   
  return (
    <div>
        <h2>{question.pregunta}</h2>
        <div className="form-verify_countdown">
          <Countdown date={targetDate} renderer={({ minutes, seconds }) => formatTime({ minutes, seconds })} onComplete={() => socket.emit('timeUp')}/>
        </div>
        <button>{question.opciones.a}</button>
        <button>{question.opciones.b}</button>
        <button>{question.opciones.c}</button>
        <button>{question.opciones.d}</button>
        <button onClick={() => socket.emit('timeUp')}>Time Up</button>
    </div>
  );
};

export default HostQuestion;