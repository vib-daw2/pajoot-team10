import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const HostQuestion = () => {
   
  return (
    <div>
        <h2>Host Question</h2>
        <button onClick={() => socket.emit('timeUp')}>Time Up</button>
    </div>
  );
};

export default HostQuestion;