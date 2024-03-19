import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerLobby = () => {
  const { game, setGame, userLogged, setUserLogged } = useStore();

  return (
    <>
    <div className='lobby-container'>
      {userLogged && userLogged.displayName && (
      <div className='lobby-player'>
        <img className='lobby-image' src={userLogged.photoURL} alt={userLogged.displayName} />
        <h1>{userLogged.displayName}</h1>
      </div>
      )}
      <img src='./assets/gif/cat-waiting.gif' className='cat-waiting' alt='Cat-waiting' />
      <p>Esperando a otros jugadores</p>
  
    </div>
    </>
  );
};

export default PlayerLobby;