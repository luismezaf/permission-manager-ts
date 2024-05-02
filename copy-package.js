const fs = require('fs');
const path = require('path');

// Ruta al archivo package.json original
const originalPath = path.join(__dirname, 'package.json');
// Ruta al destino en la carpeta dist
const destPath = path.join(__dirname, 'dist', 'package.json');

// Leer el archivo original
fs.readFile(originalPath, (err, data) => {
  if (err) {
    console.error('Error reading package.json:', err);
    return;
  }

  // Parsear el contenido como JSON
  const packageJson = JSON.parse(data);

  // Eliminar las propiedades 'scripts' y 'devDependencies'
  delete packageJson.scripts;
  delete packageJson.devDependencies;

  // Convertir de nuevo a string el JSON modificado
  const updatedContent = JSON.stringify(packageJson, null, 2);

  // Escribir el nuevo package.json en la carpeta dist
  fs.writeFile(destPath, updatedContent, (err) => {
    if (err) {
      console.error('Error writing new package.json:', err);
      return;
    }
    console.log('package.json has been copied to dist and modified successfully.');
  });
});
