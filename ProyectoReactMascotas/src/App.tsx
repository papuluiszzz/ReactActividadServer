import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Inicio from './pages/inicio';
import ModuloMascotas from './pages/moduloMascota';
import ModuloClientes from './pages/moduloCliente';
import Error404 from './pages/404';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/moduloMascotas' element={<ModuloMascotas />} />
        <Route path='/moduloClientes' element={<ModuloClientes />} />
        <Route path='/*' element={<Error404 />} />
      </Routes>
    </Router>
  )
}

export default App
