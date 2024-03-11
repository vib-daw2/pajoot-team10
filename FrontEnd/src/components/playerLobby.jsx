import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerLobby = () => {

  const { game, setGame } = useStore();
    
  return (
    <div className='lobby-container'>
      <p>Esperando a otros jugadores</p>
      <h1>Do you see your name on the host screen?</h1>
    </div>
  );
};

export default PlayerLobby;