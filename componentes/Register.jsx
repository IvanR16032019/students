import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";
import "../hoja-de-estilos/Register.css";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, lastname, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: error.message,
      });
    }
  };

  return (
    <div className="register-container">
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" sx={{ color: "black", fontWeight: "bold", mb: 3 }}>
            Registro de usuario
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Nombre" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Apellido" name="lastname" value={formData.lastname} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required sx={{ mb: 3 }} />
            
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, mb: 2 }}>
              Registrarse
            </Button>

            {/* Botón para ir a Home */}
            <Button variant="outlined" color="secondary" fullWidth sx={{ py: 1.5, mb: 2 }} onClick={() => navigate("/")}>
              Pantalla principal
            </Button>

            {/* Botón para ir a Login */}
            <Button variant="text" color="primary" fullWidth sx={{ py: 1.5 }} onClick={() => navigate("/login")}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
