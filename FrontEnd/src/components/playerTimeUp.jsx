import React, { useState, useEffect, useRef} from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Gongsound from '../../public/assets/sounds/Gong.mp3';

const PlayerTimeUp = () => {
  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha} = useStore();
  const audioRef = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [audioRef]);
  
  return (
    <>
      <p className='time-out'>Se ha acabado el tiempo</p>
      {game.remoteMode && (
        <audio id='timeup-music' src={Gongsound} autoPlay ref={audioRef} />
      )}
      <div className='question-container answer-container'>

        <h1>Respuesta {answeredCorrectly ? "Correcta!" : "Incorrecta!"}</h1>
          {answeredCorrectly ? (
            <img src='./assets/gif/cat-yes.gif' className='answer-image' alt='Gato asintiendo' />
          ) : (
            <img src='./assets/gif/cat-no.gif' className='answer-image' alt='Gato negando' />
          )}
          <p className='answer-correct'>La respuesta correcta es: {question.respuesta}</p>
      </div>
      {mensajeRacha && (
      <div className='answer-streak'>
          <img src='./assets/gif/cat-onfire.gif' className='streak-image' alt='Gato en racha' />
          <p>{mensajeRacha}</p>
      </div>
      )}
    </>
  );
};

export default PlayerTimeUp;