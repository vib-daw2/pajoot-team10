import React from 'react';

const Login = () => {
    return (
        <>
        <div className="entry-container">
            <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
            <div className="entry-credentials">
                <form method='POST' className="form-login" action=''>
                    <input type='email' className="form-login_input" name='correu' placeholder="Email" />
                    <input type="password" className="form-login_input" name="contrasenya" placeholder="Contraseña" />
                    <input type='submit' className="form-login_button" value='Acceder' />
                </form>
            </div>
            <a href="" className="login-google" ><img src="./assets/img/logo-google.png" alt="Logo-Google" /></a>
            <p>o</p>
            <a href="" className="login-anonim">Acceder de manera anónima</a>
        </div>
        </>
    );
};

export default Login;
