const fetch = require('node-fetch');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
const dialog = require('dialog');

const db = __dirname + '/db.json';

const dias_exp = /^(Lunes|Martes|Miércoles|Jueves|Viernes)/;
const fin_sem_exp = /^(Sábado|Domingo)/;

const meses = {
  Enero: 0,
  Febrero: 1,
  Marzo: 2,
  Abril: 3,
  Mayo: 4,
  Junio: 5,
  Julio: 6,
  Agosto: 7,
  Septiembre: 8,
  Octubre: 9,
  Noviembre: 10,
  Diciembre: 11,
};

function access_error() {
  return new Promise((resolve) => {
    dialog.err(
      'No tiene los permisos necesarios' 
        + ` para escribir el archivo:\n${db}`,
      'Error', 
      resolve
    );
  });
}

async function update_dates() {
  const res = await fetch('https://www.feriados.cl/');
  const $ = cheerio.load(await res.text());

  let year = $('.menuitemcur')[0].children[0].data;
  year = Number(year.split(' ')[2]);

  const tds = $('tr td:first-child');
  const feriados = [];

  for(let td of tds) {
    const contenido = td.children[0].data;

    if(!dias_exp.test(contenido) || fin_sem_exp.test(contenido)) {
      continue;
    }

    let [dia, mes] = contenido.split(' de ');
    dia = Number(dia.split(',')[1]);
    mes = meses[mes];
    let fecha = new Date(year,mes,dia);

    feriados.push(fecha.toDateString());
  }

  const resultado = await jsonfile.writeFile(db, feriados, { spaces: 2 })
    .catch(e => e.code);

  if(resultado == 'EACCES') {
    await access_error();
    process.exit(1);
  }

  console.log('Archivo de fechas feriadas actualizado');

  return feriados;
}

async function check() {
  const ahora = new Date();

  let feriados = await jsonfile.readFile(db)
    .catch(async e => {
      if(e.code == 'EACCES') { await access_error(); process.exit(1); }
      if(e.code == 'ENOENT') { return update_dates(); }
    });

  const fecha = new Date(feriados[0]);

  if(ahora.getFullYear() > fecha.getFullYear()) {
    feriados = await update_dates();
  }

  const hoy = ahora.toDateString();

  const resultado = feriados.find(fecha => fecha == hoy);

  if(resultado) {
    dialog.info('Hoy es día feriado en Chile', 'Info');
  }
}

function help() {
  return `
Comandos disponibles:
  * actualizar: Actualiza el archivo \`db.json\` utilizando la información de la página www.feriados.cl

  * consultar: Consulta el archivo \`db.json\` y muestra una ventana emergente si es día feriado

  * --version,-v: Muestra la version actual

  * --help,-h: Muestra este mensaje`;
}

const command = process.argv.slice(2)[0];

switch(command) {
  case 'actualizar':
    update_dates().catch(e => console.error({ error: e.message }));
  break;

  case 'consultar':
    check().catch(e => console.error({ error: e.message }));
  break;

  case '--version':
  case '-v':
    console.log('v1.3');
  break;

  case '--help':
  case '-h':
    console.log(help());
  break;

  default:
    console.error('Comando inválido. Use el comando --help para obtener más información de los comandos disponibles');
    process.exit(1);
  break;
}

