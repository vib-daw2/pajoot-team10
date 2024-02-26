import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const HostTimeUp= () => {
   
  return (
    <div>
        <h2>Host Time Up</h2>
        <button onClick={() => socket.emit('nextQuestion')}>Next Question</button>
        <button onClick={() => socket.emit('endGame')}>End Game</button>
    </div>
  );
};

export default HostTimeUp;