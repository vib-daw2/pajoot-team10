import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const HostGameOver = () => {
    
  return (
    <div>
        <h2>Host Game Over</h2>
        <button onClick={() => socket.emit('hostPlayAgain')}>Play Again</button>
    </div>
  );
};

export default HostGameOver;