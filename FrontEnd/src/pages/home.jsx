import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Home = () => {
    const {userLogged, setUserLogged} = useStore();
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Obtén la función de navegación

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (userLogged) {
            console.log(userLogged);
        }

    }, [userLogged, navigate]);


    return (
        <>
        {userLogged && (
            <div className='menu-top'>
                <a href=''>
                    <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
                </a>
                <div className='user-info'>
                <p>{userLogged.displayName}</p>
                    <img src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} className='user-avatar' alt='Avatar-Usuario' />
                </div>
            </div>
        )}
            <div className="entry-container new-register create-register">
            <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
                <h1>¡A jugar!</h1>
                <div className="entry-credentials new-credentials">
                    <p className='entry-title'>Unirse de manera anónima:</p>
                    <form className="form-login form-create">
                        <p>Introduce un nombre</p>
                        <input type='text' className="form-login_input" name='nombre' placeholder="Nombre" required/>
                        <p>Introduce código de juego</p>
                        <input type='tel' className="form-login_input" name='codigo' placeholder="Código" required/>
                        <input type='submit' className="form-login_button" value="Unirse"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
                {!userLogged && (
                    <div className='go-login'>
                        <p>o</p>
                        <a href='/login' className='login-link'>Iniciar sesión</a>
                    </div>
                )}

            {userLogged && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create">
                        <p>Administrar un Pajoot</p>
                        <input type='submit' className="form-login_button" value="Ver Pajoots"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            )}
            </div>
        </>
    );
};

export default Home;
