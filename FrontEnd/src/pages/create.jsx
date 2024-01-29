import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import { set } from '../../../BackEnd/mailer';

const Create = () => {
    const {userEmail, setUserEmail} = useStore();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Obtén la función de navegación

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (!userEmail) {
            // Si no hay un email, navegar automáticamente a /login
            navigate('/login');
        }
    }, [userEmail, navigate]);

    const createUser = async () => {

        if (password !== password2) {
            setError('Las contraseñas no coinciden');
            throw new Error('Las contraseñas no coinciden');
        }

        try {
            // Realizar la petición POST a la API con el email
            const response = await fetch('http://localhost:3001/api/create-user', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    user: user,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si la respuesta es exitosa, retornar los datos
                return data;
            }
            else {
                // Si hay un error en la respuesta, manejarlo
                throw new Error(data.error || 'Error creating user');
            }
        }
        catch (error) {
            // Manejar errores de red u otros errores
            if (error.message.includes('User already exists')) {
                setError('El usuario ya existe');
            }
            else {
                setError('Error creando el usuario');
            }
            throw error;
        }
    }

    const mutation = useMutation(createUser, {
        onSuccess: (data) => {
            console.log('User created successfully:', data);
            //navigate('/verify');
        },
        onError: (error) => {
            console.error('Error creating user:', error);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <>
            <div className="entry-container new-register create-register">
                <h1>Nuevo Usuario</h1>
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create" onSubmit={handleSubmit}>
                        <p>Introduce un nombre de usuario</p>
                        <input type='text' onChange={e=>setUser(e.currentTarget.value)} className="form-login_input" name='correu' placeholder="Nombre" required/>
                        <p>Elige una contraseña</p>
                        <input type="password" onChange={e=>setPassword(e.currentTarget.value)} className="form-login_input" name="contrasenya" placeholder="Contraseña" required/>
                        <p>Repite la contraseña</p>
                        <input type="password" onChange={e=>setPassword2(e.currentTarget.value)} className="form-login_input" name="contrasenya" placeholder="Contraseña" required/>
                        <input type='submit' className="form-login_button" value={mutation.isLoading ? 'Creando...' : 'Crear usuario'} disabled={mutation.isLoading}/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Create;
