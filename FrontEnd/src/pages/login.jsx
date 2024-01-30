import React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom'; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../../firebaseConfig'; 

const auth = getAuth(app);

const Login = () => {

    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError(null); // Limpiar el mensaje de error cuando el correo se actualiza
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null); // Limpiar el mensaje de error cuando el correo se actualiza
    }

    const loginUser = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            return user;
        } catch (error) {
            throw error;
        }
    }

    const mutation = useMutation(loginUser, {
        onSuccess: (user) => {
            console.log('User Logged in correctly:', user);
            navigate('/');
        },
        onError: (error) => {
            console.error('Error Logging in', error.message);
            if (error.code === 'auth/user-not-found') {
                setError('Usuario no encontrado');
            }
            else if (error.code === 'auth/invalid-credential') {
                setError('Usuario o contraseña incorrectos');
            }
            else {
                setError(error.message);
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
        <div className="entry-container">
            <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
            <div className="entry-credentials">
                <form onSubmit={handleSubmit} method='POST' className="form-login" action=''>
                    <input type='email' onChange={handleEmailChange} className="form-login_input" name='correu' placeholder="Email" required/>
                    <input type="password" onChange={handlePasswordChange} className="form-login_input" name="contrasenya" placeholder="Contraseña" required/>
                    <input type='submit' className="form-login_button" value='Acceder' />
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
            <p className="register-text">Todavía no estás registrado?</p><br/><a href="/register" className="register-new">Regístrate aquí</a>
            <hr/>
            <a href="" className="login-google" ><img src="./assets/img/logo-google.png" alt="Logo-Google" /></a>
            <p>o</p>
            <a href="" className="login-anonim">Acceder de manera anónima</a>
        </div>
        </>
    );
};

export default Login;
