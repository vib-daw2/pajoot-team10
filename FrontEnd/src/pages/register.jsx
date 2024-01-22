import React from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';

const Register = () => {
    const { userEmail, setUserEmail } = useStore();

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
    };

    const sendVerificationEmail = async () => {
        // Hacer la petición POST a localhost:3001/api/send-verification-email
        const response = await fetch('http://localhost:3001/api/send-verification-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
        });

        const data = await response.json();

        // Retornar el resultado de la petición
        return data;
    };

    const mutation = useMutation(sendVerificationEmail, {
        onSuccess: (data) => {
            console.log('Verification email sent successfully:', data);
            // Redirigir a la página de verificación
        },
        onError: (error) => {
            console.error('Error sending verification email:', error);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <div className="entry-container new-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form onSubmit={handleSubmit} className="form-login">
                        <p>Introduce un correo electrónico.<br />Te enviaremos un código de validación.</p>
                        <input
                            type='email'
                            value={userEmail || ''}
                            onChange={handleEmailChange}
                            className="form-login_input"
                            name='correu'
                            placeholder="Email"
                        />
                        <button type='submit' className="form-login_button" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Loading...' : 'Enviar código'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;

