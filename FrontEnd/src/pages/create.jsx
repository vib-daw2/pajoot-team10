import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Create = () => {
    const { userEmail, setUserEmail } = useStore();
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState('');
    const [targetDate, setTargetDate] = useState(Date.now() + 900000);
    const navigate = useNavigate();  // Obtén la función de navegación

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (!userEmail) {
            // Si no hay un email, navegar automáticamente a /login
            // navigate('/login');
        }
    }, [userEmail, navigate]);

    return (
        <>
            <div className="entry-container new-register create-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-verify">
                        <p>Introduce un nombre de usuario</p>
                        <input type='text' className="form-login_input" name='correu' placeholder="Nombre" required/>
                        <p>Elige una contraseña</p>
                        <input type="password" className="form-login_input" name="contrasenya" placeholder="Contraseña" required/>
                        <p>Repite la contraseña</p>
                        <input type="password" className="form-login_input" name="contrasenya" placeholder="Contraseña" required/>
                        <input type='submit' className="form-login_button" value='Crear' />
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Create;
