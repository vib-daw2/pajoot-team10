import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Countdown from 'react-countdown';

const PlayerQuestion = () => {

  useEffect(() => {
    socket.on('questionAnswered', () => {
      setQuestionAnswered(true);
    });
  }, []);

  const [targetDate, setTargetDate] = useState(Date.now() + 30000);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const { game, setGame, question, setQuestion, userLogged, setUserLogged} = useStore();
 
  return (
    <div>
        <h2>{question.pregunta}</h2>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"a", correctAnswer: question.respuesta, playerId:userLogged.uid, timeLeft: targetDate-Date.now()}))}>{question.opciones.a}</button>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"b", correctAnswer: question.respuesta, playerId:userLogged.uid, timeLeft: targetDate-Date.now()}))}>{question.opciones.b}</button>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"c", correctAnswer: question.respuesta, playerId:userLogged.uid, timeLeft: targetDate-Date.now()}))}>{question.opciones.c}</button>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"d", correctAnswer: question.respuesta, playerId:userLogged.uid, timeLeft: targetDate-Date.now()}))}>{question.opciones.d}</button>
    </div>
  );
};

export default PlayerQuestion;