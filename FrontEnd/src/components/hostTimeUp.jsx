import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostTimeUp= () => {

  const { game, setGame, question, setQuestion } = useStore();
   
  return (
    <div className='question-container ranking-container'>
        <h2>Tiempo Finalizado</h2>
        <h1>Clasificación</h1>
        <button className='question-button_next' onClick={() => socket.emit('nextQuestion',JSON.stringify({pin:game.pin}))}>Siguiente Pregunta</button>
    </div>
  );
};

export default HostTimeUp;