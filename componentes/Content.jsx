import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../hoja-de-estilos/Content.css";

const Content = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    age: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const generateCustomId = () => {
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        customId: doc.data().customId,
        ...doc.data(),
      }));
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const handleSearch = (e) => {
    const query = normalizeText(e.target.value);
    setSearchQuery(query);
    const filtered = employees.filter((emp) => {
      const normalizedName = normalizeText(emp.name);
      const normalizedLastname = normalizeText(emp.lastname);
      const normalizedCustomId = normalizeText(emp.customId);
      return (
        normalizedName.includes(query) ||
        normalizedLastname.includes(query) ||
        normalizedCustomId.includes(query)
      );
    });
    setFilteredEmployees(filtered);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.lastname || !formData.email || !formData.phoneNumber || !formData.age) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    const customId = generateCustomId();
    const newEmployee = { ...formData, customId };
    setEmployees([...employees, newEmployee]);
    setFilteredEmployees([...employees, newEmployee]); // Actualiza la vista de los empleados
    setFormData({ name: "", lastname: "", email: "", phoneNumber: "", age: "" });
    setSearchQuery(""); // Limpiar el campo de búsqueda después de agregar
    Swal.fire("Éxito", "Estudiante agregado correctamente", "success");
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setEmployees(employees.filter(emp => emp.id !== id));
        setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== id));
        Swal.fire("Eliminado", "El estudiante ha sido eliminado", "success");
      }
    });
  };

  const handleEdit = async () => {
    if (!formData.name || !formData.lastname || !formData.email || !formData.phoneNumber || !formData.age) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    const updatedEmployees = employees.map((emp) =>
      emp.id === currentId ? { ...emp, ...formData } : emp
    );
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees); // Actualiza la vista con los empleados modificados
    setFormData({ name: "", lastname: "", email: "", phoneNumber: "", age: "" });
    setSearchQuery(""); // Limpiar el campo de búsqueda después de actualizar
    setEditMode(false);
    setCurrentId(null);
    Swal.fire("Éxito", "Estudiante actualizado correctamente", "success");
  };

  const handleCancel = () => {
    setFormData({ name: "", lastname: "", email: "", phoneNumber: "", age: "" });
    setSearchQuery(""); // Limpiar el campo de búsqueda
    setEditMode(false);
    setCurrentId(null);
    setFilteredEmployees(employees); // Restablece la tabla con todos los empleados
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSetEdit = (emp) => {
    setFormData({
      name: emp.name,
      lastname: emp.lastname,
      email: emp.email,
      phoneNumber: emp.phoneNumber,
      age: emp.age,
    });
    setEditMode(true);
    setCurrentId(emp.id);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Lista de Estudiantes", 20, 20);

    const tableColumn = ["ID", "Nombre", "Apellido", "Email", "Teléfono", "Edad"];
    const tableRows = [];

    filteredEmployees.forEach((emp) => {
      const employeeData = [
        emp.customId,
        emp.name,
        emp.lastname,
        emp.email,
        emp.phoneNumber,
        emp.age,
      ];
      tableRows.push(employeeData);
    });

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [242, 242, 242],
      },
    });

    doc.save("estudiantes.pdf");
  };

  return (
    <div className="content-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o ID"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="logout-container">
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <h2>Gestión de Estudiantes</h2>

      <div className="form">
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
        <input type="text" name="lastname" placeholder="Apellido" value={formData.lastname} onChange={handleChange} />
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} />
        <input type="tel" name="phoneNumber" placeholder="Teléfono" value={formData.phoneNumber} onChange={handleChange} />
        <input type="number" name="age" placeholder="Edad" value={formData.age} onChange={handleChange} />
        <button onClick={editMode ? handleEdit : handleAdd}>{editMode ? "Actualizar" : "Agregar"}</button>
        {editMode && <button onClick={handleCancel}>Cancelar</button>}
      </div>

      <Button variant="contained" color="primary" onClick={handleExportPDF}>Exportar a PDF</Button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.customId}</td>
              <td>{emp.name}</td>
              <td>{emp.lastname}</td>
              <td>{emp.email}</td>
              <td>{emp.phoneNumber}</td>
              <td>{emp.age}</td>
              <td className="action-buttons">
                <button onClick={() => handleSetEdit(emp)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(emp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Content;
