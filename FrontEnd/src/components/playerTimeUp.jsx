import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerTimeUp = () => {
  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha} = useStore();
  
  return (
    <>
      <p className='time-out'>Se ha acabado el tiempo</p>
      <div className='question-container answer-container'>
        <h1>Respuesta {answeredCorrectly ? "Correcta!" : "Incorrecta!"}</h1>
          {answeredCorrectly ? (
            <img src='./assets/gif/cat-yes.gif' className='answer-image' alt='Gato asintiendo' />
          ) : (
            <img src='./assets/gif/cat-no.gif' className='answer-image' alt='Gato negando' />
          )}
          <p className='answer-correct'>La respuesta correcta es: {question.respuesta}</p>
      </div>
      {mensajeRacha && (
      <div className='answer-streak'>
          <img src='./assets/gif/cat-onfire.gif' className='streak-image' alt='Gato en racha' />
          <p>{mensajeRacha}</p>
      </div>
      )}
    </>
  );
};

export default PlayerTimeUp;