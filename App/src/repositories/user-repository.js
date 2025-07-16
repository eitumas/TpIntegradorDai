import getClient from '../configs/db-config.js';

async function obtenerUsuarioPorNombreDeUsuario(nombreUsuario) {
  const cliente = getClient();
  await cliente.connect();
  const sql = 'SELECT * FROM users WHERE username = $1';
  const valores = [nombreUsuario];
  const resultado = await cliente.query(sql, valores);
  await cliente.end();
  return resultado.rows[0];
}

async function crearUsuario(usuario) {
  const cliente = getClient();
  await cliente.connect();
  const sql = `
    INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name, last_name, username
  `;
  const valores = [usuario.first_name, usuario.last_name, usuario.username, usuario.password];
  const resultado = await cliente.query(sql, valores);
  await cliente.end();
  return resultado.rows[0];
}

export { obtenerUsuarioPorNombreDeUsuario, crearUsuario };
