import React, { useState, useEffect} from 'react';
import { socket } from '../socket';
import useStore from '../store';
import { useNavigate } from 'react-router-dom'; 

const NewQuiz = () => {

  const navigate = useNavigate();
  const { game, setGame } = useStore();

  useEffect(() => {
    socket.on('gameCreated', (game) => {
      console.log (game)
      setGame(game);
      navigate('/host');
    });
  }
  , []);


  return (
    <div>
        <h2>Empieza un pajoot!</h2>
        <h3>Elige una tematica</h3>
        <button onClick={() => socket.emit('createGame',JSON.stringify({tematica:'musica'}))}>Musica</button>
        <button onClick={() => socket.emit('createGame',JSON.stringify({tematica:'programacion'}))}>Programacion</button>
        <button onClick={() => socket.emit('createGame',JSON.stringify({tematica:'cine'}))}>Cine</button>
        <button onClick={() => socket.emit('createGame',JSON.stringify({tematica:'actualidad'}))}>Actualidad</button>
        <span>o</span>
        <button>Crea tu Propio Pajoot!</button>
    </div>
  );
};

export default NewQuiz;