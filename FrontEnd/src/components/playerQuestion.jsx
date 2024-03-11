import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerQuestion = () => {

  const { game, setGame, question, setQuestion } = useStore();
    
  return (
    <div>
        <h2>{question.pregunta}</h2>
        <button>{question.opciones.a}</button>
        <button>{question.opciones.b}</button>
        <button>{question.opciones.c}</button>
        <button>{question.opciones.d}</button>
    </div>
  );
};

export default PlayerQuestion;