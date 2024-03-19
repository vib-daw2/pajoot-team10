import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const PlayerGameClosed = () => {
    
  return (
    <div>
        <h2>El host ha cerrado el juego.</h2>
        <button onClick={() => window.location.href = '/'}>Volver al inicio</button>
    </div>
  );
};

export default PlayerGameClosed;
