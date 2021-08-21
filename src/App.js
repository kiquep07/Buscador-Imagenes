import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  // State de la app
  const [ busqueda, guardarBusqueda] = useState('');
  const [ imagenes, guardarImagenes] = useState([]);
  const [ paginaActual, guardarPaginaActual] = useState(1);
  const [ totalPaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarApi = async () => {
      if(busqueda === '') return;

      const imgPorPag = 30;
      const key = '22980857-ea692a5115550de22695cd7b7';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imgPorPag}&page=${paginaActual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      // Calcular el total de páginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imgPorPag );
      guardarTotalPaginas(calcularTotalPaginas);

      // Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({ behavior: 'smooth' })
    }
    consultarApi(); 
  }, [busqueda, paginaActual])

  // Definir la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaActual - 1;
    if(nuevaPaginaActual === 0 ) return; 
    guardarPaginaActual(nuevaPaginaActual);
  }

  // Definir página siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaActual + 1;
    if(nuevaPaginaActual > totalPaginas ) return;
    guardarPaginaActual(nuevaPaginaActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
          <p className="lead text-center">Buscador de Imágenes</p>

          <Formulario 
            guardarBusqueda={guardarBusqueda}
          />
      </div>
      <div>
          <ListadoImagenes 
            imagenes={imagenes}
          />

          <div className="d-grid gap-2 d-md-flex p-5 justify-content-md-center">
            { (paginaActual === 1) ? null : (
              <button
                type="button"
                className="bbtn btn-info mr-2"
                onClick={paginaAnterior}
              >&laquo; Anterior </button>
            ) }

            { (paginaActual === totalPaginas) ? null : (
              <button
                type="bbutton"
                className="bbtn btn-info"
                onClick={paginaSiguiente}
              >Siguiente &raquo;</button>
            ) }
          </div>
        </div>
    </div>
  );
}

export default App;
