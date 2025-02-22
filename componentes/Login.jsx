import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";
import "../hoja-de-estilos/Login.css";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Has iniciado sesión correctamente",
      });
      navigate("/content");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: error.message,
      });
    }
  };

  // Función para manejar el reset de la contraseña
  const handleResetPassword = async () => {
    const { email } = formData;
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingresa tu correo electrónico.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Correo de reinicio enviado",
        text: "Te hemos enviado un correo con instrucciones para reiniciar tu contraseña.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="login-container">
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" sx={{ color: "black", fontWeight: "bold", mb: 3 }}>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, mb: 2 }}
            >
              Iniciar Sesión
            </Button>

            {/* Botón para ir a Home */}
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ py: 1.5, mb: 2 }}
              onClick={() => navigate("/")}
            >
              Pantalla principal
            </Button>

            {/* Botón para ir a Register */}
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={() => navigate("/register")}
            >
              ¿No tienes una cuenta? Regístrate
            </Button>

            {/* Botón de "Reiniciar Contraseña" */}
            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleResetPassword} // Llama a la función para enviar el email de restablecimiento
            >
              ¿Olvidaste tu contraseña? Reiníciala
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
