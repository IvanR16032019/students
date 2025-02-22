import { useNavigate } from "react-router-dom";
import img1 from '../imagenes/img1.jpg'
import "../hoja-de-estilos/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content">
        <h1>Bienvenido a la administracion escolar</h1>
        <p>Administra tus estudiantes de manera fácil y rápida.</p>
        <div className="buttons">
          <button className="register-btn" onClick={() => navigate("/register")}>
            Registrarse
          </button>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </button>
        </div>
      </div>
      <div className="image-container">
        <img src={img1} alt="CRUD de estudiantes" />
      </div>
    </div>
  );
};

export default Home;
