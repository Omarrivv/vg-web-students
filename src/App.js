import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.css';
import StudentPage from './pages/StudentPage'; // Importaremos esta página
import EnrollmentPage from './pages/EnrollmentPage'; // Importaremos esta página

// Componente Navbar simple
function Navbar() {
  return (
    <nav style={{ marginBottom: '20px', padding: '10px', background: '#eee' }}>
      <Link to="/students" style={{ marginRight: '10px' }}>Estudiantes</Link>
      <Link to="/enrollments">Matrículas</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<h2>Bienvenido a la Gestión Escolar</h2>} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/enrollments" element={<EnrollmentPage />} />
          {/* Puedes añadir más rutas aquí, como para detalles específicos */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
