import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerTimeUp = () => {
  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha} = useStore();
  
  return (
    <div>
      <h2>Time's up!</h2>
      <h3>The correct answer was: {question.respuesta}</h3>
      <h3>Your answer was: {answeredCorrectly ? "Correct!" : "Incorrect"}</h3>
        {answeredCorrectly ? (
          <img src='./assets/gif/cat-yes.gif' className='cat-waiting' alt='Cat-waiting' />
        ) : (
          <img src='./assets/gif/cat-no.gif' className='cat-waiting' alt='Cat-waiting' />
        )}
        {mensajeRacha && (
          <h3><img src='./assets/gif/cat-onfire.gif' className='cat-waiting' alt='Cat-onfire' />{mensajeRacha}</h3>
        )}
    </div>
  );
};

export default PlayerTimeUp;