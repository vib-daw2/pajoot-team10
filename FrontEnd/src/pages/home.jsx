import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Home = () => {
    const {userLogged, setUserLogged} = useStore();
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Obtén la función de navegación
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (userLogged) {
            console.log(userLogged);
        }

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

    }, [userLogged, navigate]);

    const handleLogout = () => {
        // Cerrar sesión
        console.log('Cerrando sesión..');
        setUserLogged(null);
        
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <>
        
            <div className='menu-top'>
                <a href=''>
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
                            <a onClick={toggleDropdown}>v</a>
                            <a href='#'>Editar Perfil</a>
                            <a href='' onClick={handleLogout}>Cerrar Sesión</a>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div className="entry-container new-register create-register">
                <h1>¡A jugar!</h1>
                {!userLogged && (
                <div className="entry-credentials new-credentials">
                    <p className='entry-title'>Unirse de manera anónima</p>
                    <form className="form-login form-create">
                        <p>Introduce un nombre</p>
                        <input type='text' className="form-login_input" name='nombre' placeholder="Nombre" required/>
                        <p>Introduce código de juego</p>
                        <input type='tel' className="form-login_input" name='codigo' placeholder="Código" required/>
                        <input type='submit' className="form-login_button" value="Unirse"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
                )}
                {userLogged && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create">
                        <p>Introduce código de juego</p>
                        <input type='tel' className="form-login_input" name='codigo' placeholder="Código" required/>
                        <input type='submit' className="form-login_button" value="Unirse"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
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
