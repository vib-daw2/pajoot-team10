import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostLobby = () => {
  const { game, setGame } = useStore();

  useEffect(() => {

    socket.on('updatePlayerBoard', (game) => {

      setGame(game);
      
    });

  },[]);

  return (
    <div>
      <h2>Join this Game using the game pin:</h2>
      
      {game &&(<h1>{game.pin}</h1>)}
      <h2>Players:</h2>
      {game && Array.isArray(game.gameData.players.players) ? (
        game.gameData.players.players.map((player, index) => (
          <h3 key={index}>{player.name}</h3>
        ))
      ) : (
        <p>No players available</p>
      )}
      <button onClick={() => socket.emit('startGame', JSON.stringify({pin:game.pin}))}>Start Game</button>
      <button onClick={() => socket.emit('cancelGame')}>Cancel Game</button>
    </div>
  );
};

export default HostLobby;
