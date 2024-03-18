import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Countdown from 'react-countdown';

const PlayerQuestion = () => {

  useEffect(() => {
    socket.on('questionAnswered', (answeredCorrectly) => {
      setAnsweredCorrectly(answeredCorrectly);
      if (answeredCorrectly) {
        setRacha(racha + 0.1);
        console.log(racha);
      }
      else {
        setRacha(1);
        console.log("racha perdida");
      }

      if (answeredCorrectly && racha > 1.1) {
        setMensajeRacha('Estas en racha! Multiplicador actual: x' + racha.toFixed(2));
        console.log (mensajeRacha);
      }

      if (!answeredCorrectly && racha > 1.1) {
        setMensajeRacha('Perdiste la racha... Multiplicador actual: x1');
        console.log (mensajeRacha);
      }
      
      setQuestionAnswered(true);
    });
  }, []);

  const [targetDate, setTargetDate] = useState(Date.now() + 30000);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly,racha,setRacha,mensajeRacha,setMensajeRacha} = useStore();

  const score = game.gameData.players.players.find((player) => player.playerId == userLogged.uid).gameData.score;
 
  return (
    <div>
        <h2>Score: {score.toFixed()}</h2>
        <h2>{question.pregunta}</h2>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"a", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}>{question.opciones.a}</button>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"b", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}>{question.opciones.b}</button>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"c", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}>{question.opciones.c}</button>
        <button disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"d", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}>{question.opciones.d}</button>
    </div>
  );
};

export default PlayerQuestion;