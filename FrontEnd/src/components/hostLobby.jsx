import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostLobby = () => {
  const { game, setGame } = useStore();

  useEffect(() => {
    socket.on('playerJoined', (game) => {
      console.log('hola');
      setGame(game);
    });
  }
  , [game]);

  return (
    <div>
      <h2>Join this Game using the game pin:</h2>
      <h1>{game.pin}</h1>
      <h2>Players:</h2>
      {Array.isArray(game.gameData.players) ? (
        game.gameData.players.map((player, index) => (
          <h3 key={index}>{player.name}</h3>
        ))
      ) : (
        <p>No players available</p>
      )}
      <button onClick={() => socket.emit('startGame')}>Start Game</button>
      <button onClick={() => socket.emit('cancelGame')}>Cancel Game</button>
    </div>
  );
};

export default HostLobby;
