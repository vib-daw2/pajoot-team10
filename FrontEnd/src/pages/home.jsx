import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Home = () => {
    const {userLogged, setUserLogged} = useStore();
    const [anon, isAnon] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Obtén la función de navegación

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (!userLogged) {
            isAnon(true);
            // Si no hay un email, navegar automáticamente a /login
            // navigate('/login');
        }
        else{
            console.log(userLogged);
        }
    }, [userLogged, navigate]);


    return (
        <>
            <div className="entry-container new-register create-register">
                <h1>¡A jugar!</h1>
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create">
                        <p>Introduce código de juego</p>
                        <input type='tel' className="form-login_input" name='codigo' placeholder="Código" required/>
                        <input type='submit' className="form-login_button" value="Unirse"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                    </div>
            {!anon && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create">
                        <p>Crear un nuevo Pajoot</p>
                        <input type='submit' className="form-login_button" value="Crear"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            )}
            </div>
        </>
    );
};

export default Home;
