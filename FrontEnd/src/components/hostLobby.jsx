import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const HostLobby = () => {

  return (
    <div>

      <h2>Join this Game using the game pin:</h2>

      <h1>123456</h1>

      <h2>Players:</h2>

      <h3>Player 1</h3>
      <h3>Player 2</h3>
      <h3>Player 3</h3>
      <h3>Player 4</h3>
      <h3>Player 5</h3>

      <button onClick={() => socket.emit('startGame')}>Start Game</button>
      <button onClick={() => socket.emit('cancelGame')}>Cancel Game</button>

    </div>
  );
};

export default HostLobby;