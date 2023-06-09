const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para agregar una canción al repertorio
app.post('/canciones', (req, res) => {
  const { id, titulo, artista, tono } = req.body;
  const repertorio = getRepertorio();
  const nuevaCancion = { id, titulo, artista, tono };
  repertorio.push(nuevaCancion);
  guardarRepertorio(repertorio);
  res.json(repertorio);
});

// Ruta para obtener todas las canciones del repertorio
app.get('/canciones', (req, res) => {  
  const repertorio = getRepertorio();
  res.json(repertorio);
});

// Ruta para editar una canción en el repertorio
app.put('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, artista, tono } = req.body;
  const repertorio = getRepertorio();
  const cancionIndex = repertorio.findIndex(cancion => cancion.id == id);
  if (cancionIndex !== -1) {
    repertorio[cancionIndex].titulo = titulo;
    repertorio[cancionIndex].artista = artista;
    repertorio[cancionIndex].tono = tono;
    guardarRepertorio(repertorio);
  }
  res.json(repertorio);
});

// Ruta para eliminar una canción del repertorio
app.delete('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const repertorio = getRepertorio();
  const cancionesFiltradas = repertorio.filter(cancion => cancion.id != id);
  if (cancionesFiltradas.length !== repertorio.length) {
    guardarRepertorio(cancionesFiltradas);
  }
  res.json(cancionesFiltradas);
});

// Función para obtener el repertorio desde el archivo JSON
function getRepertorio() {
  const repertorioData = fs.readFileSync('repertorio.json');
  return JSON.parse(repertorioData);
}

// Función para guardar el repertorio en el archivo JSON
function guardarRepertorio(repertorio) {
  const repertorioData = JSON.stringify(repertorio, null, 2);
  fs.writeFileSync('repertorio.json', repertorioData);
}

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});