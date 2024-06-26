import { useNavigate, Link} from 'react-router-dom';

const Notfound = () => {
    return (
        <>
        <div className="not-container">
            <div className="not-info">
                <div className="not-content">
                    <h1>Error 404</h1>
                    <p class="not-text">¡Ups!</p>
                    <p class="not-text">No hemos encontrado la página<br/>o está temporalmente fuera de servicio.</p>
                </div>
                <img src='/assets/img/NotFoundCat.png' className="404Image" alt="Not found image" />
            </div>
            <Link to="/" className="not-button">Volver a Inicio</Link>
        </div>
        </>
    );
};

export default Notfound;