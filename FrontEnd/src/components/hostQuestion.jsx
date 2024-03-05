import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Countdown from 'react-countdown';

const HostQuestion = () => {

  const [targetDate, setTargetDate] = useState(Date.now() + 30000);
  const formatTime = ({ minutes, seconds }) => {
    // Puedes personalizar el formato según tus necesidades
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

useEffect(() => {

  console.log('reset timer');
  setTargetDate(Date.now() + 30000);

},[])
   
  return (
    <div>
        <h2>Host Question</h2>
        <div className="form-verify_countdown">
          <Countdown date={targetDate} renderer={({ minutes, seconds }) => formatTime({ minutes, seconds })} onComplete={() => socket.emit('timeUp')}/>
        </div>
        <button onClick={() => socket.emit('timeUp')}>Time Up</button>
    </div>
  );
};

export default HostQuestion;