import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../componentes/AuthContext"; // Asegúrate de tener un AuthContext

const Private = () => {
  const { user, loading } = useAuth(); // Obtener usuario y loading del contexto

  if (loading) {
    return <div>Loading...</div>; // Muestra algo mientras se verifica el estado de autenticación
  }

  return user ? <Outlet /> : <Navigate to="/login" />; // Redirige a login si no hay usuario autenticado
};

export default Private;
