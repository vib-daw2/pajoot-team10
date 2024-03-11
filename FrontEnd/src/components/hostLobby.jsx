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
    <div className='lobby-container'>
      <p>Código</p>
      
      {game &&(<h1>{game.pin}</h1>)}

      <p>Jugadores</p>
      {game && Array.isArray(game.gameData.players.players) ? (
        game.gameData.players.players.map((player, index) => (
          <h3 key={index}>{player.name}</h3>
        ))
      ) : (
        <p>Todavía no hay jugadores</p>
      )}
      <button className= 'lobby-button' onClick={() => socket.emit('cancelGame')}>Cancelar</button>
      <button className= 'lobby-button' onClick={() => socket.emit('startGame', JSON.stringify({pin:game.pin}))}>Iniciar</button>
    </div>
  );
};

export default HostLobby;
