import getClient from '../configs/db-config.js';

async function obtenerTodosLosEventos({ pagina = 1, limite = 10, nombre, fechaInicio, etiqueta }) {
  const cliente = getClient();
  await cliente.connect();

  let filtros = [];
  let valores = [];
  let indice = 1;

  if (nombre) {
    filtros.push(`e.name ILIKE '%' || $${indice} || '%'`);
    valores.push(nombre);
    indice++;
  }
  if (fechaInicio) {
    filtros.push(`DATE(e.start_date) = $${indice}`);
    valores.push(fechaInicio);
    indice++;
  }
  if (etiqueta) {
    filtros.push(`t.name ILIKE '%' || $${indice} || '%'`);
    valores.push(etiqueta);
    indice++;
  }

  const clausulaWhere = filtros.length > 0 ? `WHERE ${filtros.join(' AND ')}` : '';

  const desplazamiento = (pagina - 1) * limite;

  const sql = `
    SELECT 
      e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance,
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'username', u.username
      ) AS usuario_creador,
      json_build_object(
        'id', el.id,
        'name', el.name,
        'full_address', el.full_address,
        'max_capacity', el.max_capacity,
        'latitude', el.latitude,
        'longitude', el.longitude,
        'location', json_build_object(
          'id', l.id,
          'name', l.name,
          'id_province', l.id_province,
          'latitude', l.latitude,
          'longitude', l.longitude,
          'province', json_build_object(
            'id', p.id,
            'name', p.name,
            'full_name', p.full_name,
            'latitude', p.latitude,
            'longitude', p.longitude,
            'display_order', p.display_order
          )
        )
      ) AS ubicacion_evento,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', tg.id, 'name', tg.name)) FILTER (WHERE tg.id IS NOT NULL), '[]') AS etiquetas
    FROM events e
    LEFT JOIN users u ON e.id_creator_user = u.id
    LEFT JOIN event_locations el ON e.id_event_location = el.id
    LEFT JOIN locations l ON el.id_location = l.id
    LEFT JOIN provinces p ON l.id_province = p.id
    LEFT JOIN event_tags et ON e.id = et.id_event
    LEFT JOIN tags tg ON et.id_tag = tg.id
    ${clausulaWhere}
    GROUP BY e.id, u.id, el.id, l.id, p.id
    ORDER BY e.start_date ASC
    LIMIT $${indice} OFFSET $${indice + 1}
  `;

  valores.push(limite, desplazamiento);

  const resultado = await cliente.query(sql, valores);
  await cliente.end();
  return resultado.rows;
}

async function obtenerEventoPorId(id) {
  const cliente = getClient();
  await cliente.connect();

  const sql = `
    SELECT 
      e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance,
      json_build_object(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'username', u.username
      ) AS usuario_creador,
      json_build_object(
        'id', el.id,
        'id_location', el.id_location,
        'name', el.name,
        'full_address', el.full_address,
        'max_capacity', el.max_capacity,
        'latitude', el.latitude,
        'longitude', el.longitude,
        'id_creator_user', el.id_creator_user,
        'location', json_build_object(
          'id', l.id,
          'name', l.name,
          'id_province', l.id_province,
          'latitude', l.latitude,
          'longitude', l.longitude,
          'province', json_build_object(
            'id', p.id,
            'name', p.name,
            'full_name', p.full_name,
            'latitude', p.latitude,
            'longitude', p.longitude,
            'display_order', p.display_order
          )
        ),
        'creator_user', json_build_object(
          'id', cu.id,
          'first_name', cu.first_name,
          'last_name', cu.last_name,
          'username', cu.username,
          'password', '******'
        )
      ) AS ubicacion_evento,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', tg.id, 'name', tg.name)) FILTER (WHERE tg.id IS NOT NULL), '[]') AS etiquetas,
      json_build_object(
        'id', cu2.id,
        'first_name', cu2.first_name,
        'last_name', cu2.last_name,
        'username', cu2.username,
        'password', '******'
      ) AS usuario_creador
    FROM events e
    LEFT JOIN users u ON e.id_creator_user = u.id
    LEFT JOIN event_locations el ON e.id_event_location = el.id
    LEFT JOIN locations l ON el.id_location = l.id
    LEFT JOIN provinces p ON l.id_province = p.id
    LEFT JOIN users cu ON el.id_creator_user = cu.id
    LEFT JOIN event_tags et ON e.id = et.id_event
    LEFT JOIN tags tg ON et.id_tag = tg.id
    LEFT JOIN users cu2 ON e.id_creator_user = cu2.id
    WHERE e.id = $1
    GROUP BY e.id, u.id, el.id, l.id, p.id, cu.id, cu2.id
  `;

  const valores = [id];
  const resultado = await cliente.query(sql, valores);
  await cliente.end();
  return resultado.rows[0];
}

export { obtenerTodosLosEventos, obtenerEventoPorId };
