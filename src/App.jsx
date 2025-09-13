// src/App.jsx
import React, { Suspense, lazy, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'  // ✅ aquí importamos el componente, no como CSS

const Home = lazy(() => import('./components/Home'))
const Proyectos = lazy(() => import('./components/Proyectos'))
const Somos = lazy(() => import('./components/Somos'))
const Contacto = lazy(() => import('./components/Contacto'))


function App() {
  const [count, setCount] = useState(0)

  return (
    <Suspense fallback={<div className="text-center mt-20 text-xl text-gray-500">Cargando...</div>}>
      <Navbar />  
      
<section id="home">
  <Home />
</section>
<section id="proyectos">  
  <Proyectos />
</section>
<section id="somos">
  <Somos />
</section>
<section id="contacto">
  <Contacto />
</section>
    </Suspense> 
  )
}

export default App