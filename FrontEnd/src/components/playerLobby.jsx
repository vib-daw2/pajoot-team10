import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerLobby = () => {

  const { game, setGame } = useStore();
    
  return (
    <div>
      <h2>Waiting on host to start game</h2>
      <h3>Do you see your name on the host screen?</h3>
    </div>
  );
};

export default PlayerLobby;