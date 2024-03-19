import React, { useState, useEffect} from 'react';
import { socket } from '../socket';
import useStore from '../store';
import app from '../../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 

const NewQuiz = () => {
  const {userLogged, setUserLogged, game, setGame} = useStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [remoteMode, setRemoteMode] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    socket.on('gameCreated', (game) => {
      setGame(game);
      navigate('/host');
    });
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
          setDropdownOpen(false);
      }
    };

    // Agregar event listener al montar el componente
    document.addEventListener('click', handleClickOutside);

    // Limpiar event listener al desmontar el componente
    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
  }
  , []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
};

const handleLogout = () => {
  // Cerrar sesión
  console.log('Cerrando sesión..');

  auth.signOut();
  setUserLogged(null);
  
  navigate('/');
};


  return (
    <>
      <div className='menu-top'>
      <a href='/'>
          <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
      </a>
      {!userLogged && (
      <div className='user-info'>
          <a href='/login' className='login-link'>Iniciar sesión</a>
          <img src='./assets/img/usuario-de-perfil.png' className='user-avatar' alt='Avatar-Usuario' />
      </div>
      )}
      {userLogged && (
      <div className='user-info'>
          <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
              <button className='dropbtn'>
                  <p id='user-display-name' className='login-link'>{userLogged.displayName}</p>
                  <img src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} className='user-avatar' alt='Avatar-Usuario' />
              </button>
              <div className='dropdown-content'>
                  <div className='triangle'></div>
                  <a href='/profile'>Editar Perfil</a>
                  <a href='' onClick={handleLogout}>Cerrar Sesión</a>
              </div>
          </div>
      </div>
      )}
      </div>
      <div className='choose-container'>
          <h1>Iniciar un Pajoot</h1>
          <div className='choose-content'>
            <div className='choose-container_buttons'>
              <button className='choose-button' onClick={() => socket.emit('createGame',JSON.stringify({tematica:'musica',modoRemoto:remoteMode}))}>Música</button>
              <button className='choose-button' onClick={() => socket.emit('createGame',JSON.stringify({tematica:'programacion',modoRemoto:remoteMode}))}>Programación</button>
              <button className='choose-button' onClick={() => socket.emit('createGame',JSON.stringify({tematica:'cine',modoRemoto:remoteMode}))}>Cine</button>
              <button className='choose-button' onClick={() => socket.emit('createGame',JSON.stringify({tematica:'actualidad',modoRemoto:remoteMode}))}>Actualidad</button>
            </div>
            <p>o</p>
            <button className='create-button'>Crear Nuevo</button>
          </div>
      </div>
      <input type= 'checkbox' id='remote-mode' name='remote-mode' value='remote-mode' checked={remoteMode} onChange={() => setRemoteMode(!remoteMode)}/>
      <label for='remote-mode'>Modo Remoto</label>
    </>
  );
};

export default NewQuiz;