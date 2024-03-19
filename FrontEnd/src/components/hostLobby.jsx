import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';

const HostLobby = () => {
  const { game, setGame } = useStore();
  const navigate = useNavigate();
  
  const handleCancelGame = () => {
    // Aquí puedes agregar cualquier lógica adicional que necesites antes de navegar a la página "choose"
    socket.emit('cancelGame');

    // Navegar a la página "choose"
    navigate('/choose');
  };
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
      <div className='lobby-content'>
        {game && Array.isArray(game.gameData.players.players) ? (
          game.gameData.players.players.map((player, index) => (
            <p className='player-name' key={index}>{player.name}</p>
          ))
        ) : (
          <p>Todavía no hay jugadores</p>
        )}
      </div>
      <div className='lobby-buttons'>
        <button className= 'lobby-button' onClick={handleCancelGame}>Cancelar</button>
        <button className= 'lobby-button' onClick={() => socket.emit('startGame', JSON.stringify({pin:game.pin}))}>Iniciar</button>
      </div>
    </div>
  );
};

export default HostLobby;
