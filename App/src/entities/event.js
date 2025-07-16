// entities/event.js
export default function Event(data) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      id_event_category: data.id_event_category,
      id_event_location: data.id_event_location,
      start_date: data.start_date,
      duration_in_minutes: data.duration_in_minutes,
      price: data.price,
      enabled_for_enrollment: data.enabled_for_enrollment,
      max_assistance: data.max_assistance,
      id_creator_user: data.id_creator_user,
    };
  }
  