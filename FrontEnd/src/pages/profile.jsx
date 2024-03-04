import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import app from '../../firebaseConfig';
import { getAuth, signOut, updateProfile } from 'firebase/auth';

const Profile = () => {
    const {userLogged, setUserLogged} = useStore();
    const [user, setUser] = useState(userLogged ? userLogged.displayName || '' : '');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const auth = getAuth(app);
    const [profileImage, setProfileImage] = useState(null);

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (userLogged) {
            setUser(userLogged.displayName || '');
        };
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

    const mutation = useMutation(() => {
        // Actualizar el nombre de usuario en Firebase
        return updateProfile(auth.currentUser, { displayName: user })
            .then(() => {
                // Actualizar el estado global con el nuevo nombre de usuario
                setUserLogged({ ...userLogged, displayName: user });
            })
            .catch((error) => {
                setError(error.message);
            });
    });

    const handleInputChange = (e) => {
        setUser(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        console.log(file);
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
                {userLogged && (
                <div className='user-info'>
                    <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
                        <button className='dropbtn'>
                            <p id='user-display-name' className='login-link'>{userLogged.displayName}</p>
                            <img src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} className='user-avatar' alt='Avatar-Usuario' />
                        </button>
                        <div className='dropdown-content'>
                            <div className='triangle'></div>
                            <a href='#'>Editar Perfil</a>
                            <a href='' onClick={handleLogout}>Cerrar Sesión</a>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div className="entry-container new-register create-register">
                <h1>Perfil</h1>
                {userLogged && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create" onSubmit={handleSubmit}>
                        <p>Nombre</p>
                        <input type='text' className="form-login_input" name='nombre' placeholder="Nombre" value={user} onChange={handleInputChange} required/>
                        <p>Avatar</p>
                        <img src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} onChange={handleImageChange} className='user-avatar' alt='Avatar-Usuario' />
                        <button className='form-avatar_button'>Elegir otro</button>
                        <input type='submit' className="form-login_button" value="Guardar"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
                )}
            </div>
        </>
    );
};

export default Profile;
