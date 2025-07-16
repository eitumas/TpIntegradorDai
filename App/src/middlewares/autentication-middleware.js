import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const autenticarToken = (req, res, next) => {
  const encabezadoAutorizacion = req.headers['authorization'];
  const token = encabezadoAutorizacion && encabezadoAutorizacion.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ exito: false, mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
    if (error) {
      return res.status(401).json({ exito: false, mensaje: 'Token inválido' });
    }
    req.usuario = usuario;
    next();
  });
};

export default autenticarToken;
