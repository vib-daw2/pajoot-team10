import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostGameOver = () => {
  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha } = useStore();

  // Obtener la lista de jugadores del juego
  const players = game.gameData.players.players;

  // Ordenar los jugadores por puntuación
  const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);

  function handleCloseGame(){
    socket.emit('closeGame', JSON.stringify({ pin: game.pin }));
    window.location.href = '/';
  }

  return (
    <div>
      <h2>¡Podium Final!</h2>
      <ul>
        {/* Mapear y renderizar los jugadores en orden de puntuación */}
        {sortedPlayers.map((player, index) => (
          <li key={player.playerId}>
            <img src={player.photo} alt={player.name} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
            {index + 1}. {player.name}: {(player.gameData.score).toFixed()}
          </li>
        ))}
      </ul>
      <button onClick={(handleCloseGame)}>Finalizar juego</button>
    </div>
  );
};

export default HostGameOver;