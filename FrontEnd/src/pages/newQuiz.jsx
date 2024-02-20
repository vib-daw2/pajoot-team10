import React, { useState } from 'react';

const NewQuiz = () => {

  return (
    <div>
        <h2>Start a Kahoot Game</h2>
        <h3>Choose the theme</h3>
        <button>Music</button>
        <button>Coding</button>
        <button>Cinema</button>
        <button>Actuality</button>
        <span>or</span>
        <button>Create your Own Pajoot!</button>
    </div>
  );
};

export default NewQuiz;