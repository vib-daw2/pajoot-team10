import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Verify = () => {
    const { userEmail, setUserEmail } = useStore();
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState('');
    const [targetDate, setTargetDate] = useState(Date.now() + 900000);
    const navigate = useNavigate();  // Obtén la función de navegación

    // Función para formatear la salida del contador
    const formatTime = ({ minutes, seconds }) => {
        // Puedes personalizar el formato según tus necesidades
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (!userEmail) {
            // Si no hay un email, navegar automáticamente a /login
            navigate('/login');
        }
    }, [userEmail, navigate]);

    return (
        <>
            <div className="entry-container new-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-verify">
                        <p>Introduce el código de validación</p>
                        <div className="form-verify_countdown">
                            <Countdown date={targetDate} renderer={({ minutes, seconds }) => formatTime({ minutes, seconds })} />
                        </div>
                        <OtpInput
                            inputType='tel'
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={'form-verify_input'}
                            required
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button type='submit' className="form-login_button form-verify_button">
                            Validar
                        </button>
                    </form>
                </div>
                <p className="register-text">No ha llegado el código?</p><br /><a href="" className="register-new">Volver a enviar</a>
            </div>
        </>
    );
};

export default Verify;
