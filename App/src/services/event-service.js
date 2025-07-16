import { obtenerTodosLosEventos, obtenerEventoPorId } from '../repositories/event-repository.js';

async function obtenerTodosLosEventosServicio(parametros) {
  // parametros: { pagina, limite, nombre, fechaInicio, etiqueta }
  return await obtenerTodosLosEventos(parametros);
}

async function obtenerEventoPorIdServicio(id) {
  return await obtenerEventoPorId(id);
}

export { obtenerTodosLosEventosServicio, obtenerEventoPorIdServicio };
