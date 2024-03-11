import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostTimeUp= () => {

  const { game, setGame, question, setQuestion } = useStore();
   
  return (
    <div>
        <h2>Host Time Up</h2>
        <button onClick={() => socket.emit('nextQuestion',JSON.stringify({pin:game.pin}))}>Next Question</button>
    </div>
  );
};

export default HostTimeUp;