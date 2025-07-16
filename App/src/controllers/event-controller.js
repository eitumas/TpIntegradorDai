import { Router } from 'express';
import { obtenerTodosLosEventosServicio, obtenerEventoPorIdServicio } from '../services/event-service.js';
import autenticarToken from '../middlewares/autentication-middleware.js';

const router = Router();

// Listado de eventos con paginación y filtros
router.get('/', async (req, res) => {
  try {
    const { pagina, limite, nombre, fechaInicio, etiqueta } = req.query;
    const parametros = {
      pagina: pagina ? parseInt(pagina) : 1,
      limite: limite ? parseInt(limite) : 10,
      nombre,
      fechaInicio,
      etiqueta,
    };
    const eventos = await obtenerTodosLosEventosServicio(parametros);
    res.status(200).json({ coleccion: eventos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener eventos', error: error.message });
  }
});

// Detalle de un evento por id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const evento = await obtenerEventoPorIdServicio(id);

    if (evento) {
      res.status(200).json(evento);
    } else {
      res.status(404).send('Evento no encontrado');
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el evento', error: error.message });
  }
});

// Aquí se agregarán las rutas para CRUD, inscripción, etc. con autenticación

export default router;
  