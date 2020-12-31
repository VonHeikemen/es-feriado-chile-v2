## Instalación

Asegúrate de tener instalado Node.js >= v10. [Instalar Node.js](https://nodejs.org/en/download/package-manager/)

### Descargando el script minificado

Ve a la página de [release](https://github.com/VonHeikemen/es-feriado-chile-v2/releases), descarga el archivo zip y extrae la versión minificada.

### Desde la fuente

Clona/Descarga el repositorio e instala las dependencias.

```
 git clone https://github.com/VonHeikemen/es-feriado-chile-v2
 cd es-feriado-chile-v1
 npm install
```

## Uso

### Actualizar

Actualiza base de datos (`db.json`) de días feriados utilizando la información en la página `www.feriados.cl`.

```
node ./feriados.js actualizar
```

### Consultar

Revisa la base de datos y revisa si es día feriado. Si es día feriado aparecerá una ventana emergente.

```
node ./feriados.js consultar
```

### --version,-v

Muestra la versión actual.

```
node ./feriados.js --version
```

### --help,-h

```
node ./feriados.js --help
```

