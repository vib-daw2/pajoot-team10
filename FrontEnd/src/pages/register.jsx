import React from 'react';

const Login = () => {
    return (
        <>
        <div className="entry-container new-register">
            <h1>Nuevo Usuario</h1>
            <div className="entry-credentials new-credentials">
                <form method='POST' className="form-login" action=''>
                    <p>Introduce un correo electrónico.<br/>Te enviaremos un código de validación.</p>
                    <input type='email' className="form-login_input" name='correu' placeholder="Email" />
                    <input type='submit' className="form-login_button" value='Enviar código' />
                </form>
            </div>
        </div>
        </>
    );
};

export default Login;
