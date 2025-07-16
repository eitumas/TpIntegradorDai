import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { obtenerUsuarioPorNombreDeUsuario, crearUsuario } from '../repositories/user-repository.js';

dotenv.config();

const saltRounds = 10;

function validarEmail(email) {
  const re = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
  return re.test(email);
}

async function registrarUsuario(usuario) {
  const { first_name, last_name, username, password } = usuario;

  if (!first_name || first_name.length < 3) {
    throw new Error('El campo first_name está vacío o tiene menos de tres letras.');
  }
  if (!last_name || last_name.length < 3) {
    throw new Error('El campo last_name está vacío o tiene menos de tres letras.');
  }
  if (!validarEmail(username)) {
    throw new Error('El email es inválido.');
  }
  if (!password || password.length < 3) {
    throw new Error('El campo password está vacío o tiene menos de tres letras.');
  }

  const usuarioExistente = await obtenerUsuarioPorNombreDeUsuario(username);
  if (usuarioExistente) {
    throw new Error('El usuario ya existe.');
  }

  const passwordHasheado = await bcrypt.hash(password, saltRounds);
  const nuevoUsuario = await crearUsuario({
    first_name,
    last_name,
    username,
    password: passwordHasheado,
  });

  return nuevoUsuario;
}

async function iniciarSesion(username, password) {
  if (!validarEmail(username)) {
    throw new Error('El email es inválido.');
  }

  const usuario = await obtenerUsuarioPorNombreDeUsuario(username);
  if (!usuario) {
    throw new Error('Usuario o clave inválida.');
  }

  const coincide = await bcrypt.compare(password, usuario.password);
  if (!coincide) {
    throw new Error('Usuario o clave inválida.');
  }

  const token = jwt.sign(
    { id: usuario.id, first_name: usuario.first_name, last_name: usuario.last_name, username: usuario.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token };
}

export { registrarUsuario, iniciarSesion };
