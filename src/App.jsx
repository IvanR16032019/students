import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../componentes/Home";
import Register from "../componentes/Register";
import Login from "../componentes/Login"; //HASHROUTER
import Private from "../componentes/Private";
import Content from "../componentes/Content";
import { AuthProvider } from "../componentes/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route element={<Private />}>
            <Route path="/content" element={<Content />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
