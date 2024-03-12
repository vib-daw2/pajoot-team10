import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerLobby = () => {
  const { game, setGame, userLogged, setUserLogged } = useStore();

  return (
    <div className='lobby-container'>
      <p>Esperando a otros jugadores</p>
      {userLogged && userLogged.displayName && (
        <h1>{userLogged.displayName}</h1>
      )}
      <img src='./assets/gif/cat-waiting.gif' className='cat-waiting' alt='Cat-waiting' />
    </div>
  );
};

export default PlayerLobby;