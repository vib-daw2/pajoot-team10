import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerTimeUp = () => {
  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly } = useStore();
  
  return (
    <div>
      <h2>Time's up!</h2>
      <h3>The correct answer was: {question.respuesta}</h3>
      <h3>Your answer was: {answeredCorrectly ? "Correct!" : "Incorrect"}</h3>
        {answeredCorrectly ? (
          <img src='./assets/gif/cat-win.gif' className='cat-waiting' alt='Cat-waiting' />
        ) : (
          <img src='./assets/gif/cat-lose.gif' className='cat-waiting' alt='Cat-waiting' />
        )}
    </div>
  );
};

export default PlayerTimeUp;