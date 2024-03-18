import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostTimeUp= () => {

  const { game, setGame, question, setQuestion } = useStore();

  const players = game.gameData.players.players;

  // Ordenar los jugadores por puntuación
  const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);
   
  return (
    <div className='question-container ranking-container'>
        <h2>Tiempo Finalizado</h2>
        <h1>Clasificación</h1>
        <ul>
        {/* Mapear y renderizar los jugadores en orden de puntuación */}
        {sortedPlayers.map((player, index) => (
          <li key={player.playerId}>
            <img src={player.photo} alt={player.playerName} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
            {index + 1}. {player.name}: {(player.gameData.score).toFixed()}
          </li>
        ))}
      </ul>
        <button className='question-button_next' onClick={() => socket.emit('nextQuestion',JSON.stringify({pin:game.pin}))}>Siguiente Pregunta</button>
    </div>
  );
};

export default HostTimeUp;