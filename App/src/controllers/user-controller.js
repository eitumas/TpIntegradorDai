import { Router } from 'express';
import { registrarUsuario, iniciarSesion } from '../services/user-service.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuario(req.body);
    res.status(201).json({ exito: true, mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ exito: false, mensaje: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token } = await iniciarSesion(username, password);
    res.status(200).json({ exito: true, mensaje: '', token });
  } catch (error) {
    if (error.message === 'El email es inválido.') {
      res.status(400).json({ exito: false, mensaje: error.message, token: '' });
    } else {
      res.status(401).json({ exito: false, mensaje: error.message, token: '' });
    }
  }
});

export default router;
