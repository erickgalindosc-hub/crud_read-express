import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/menu';
import Clientes from './components/Clientes';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Bienvenido al sistema de ventas</h2>} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;