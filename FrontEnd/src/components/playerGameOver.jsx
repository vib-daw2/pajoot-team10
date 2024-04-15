import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerGameOver = () => {

  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha } = useStore();
  const [playerPosition, setPlayerPosition] = useState(null);

  useEffect(() => {
    const players = game.gameData.players.players;
    const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);
    const userIndex = sortedPlayers.findIndex(player => player.playerId === userLogged.uid);
    
    if (userIndex !== -1) {
      // El jugador está en la lista de jugadores
      const position = userIndex + 1;
      setPlayerPosition(position);
    } else {
      // El jugador no está en la lista de jugadores (por ejemplo, si se desconectó antes del final del juego)
      setPlayerPosition(null);
    }
  }, [game, userLogged]);

  
  return (
    <div className='time-out'>
        <h1>¡Se acabó el juego!</h1>
        {playerPosition !== null && (
        <h1>¡Has quedado {playerPosition}º!</h1>
      )}
    </div>
  );
};

export default PlayerGameOver;