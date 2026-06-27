function formatDateValue(value) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().slice(0, 10);
}

function formatTimeValue(value) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(11, 16);
  }

  if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().slice(11, 16);
}

function serializeTicket(ticket) {
  const sold = Number(ticket.registrations || 0);
  const capacity = Number(ticket.maxTickets || 0);

  return {
    id: String(ticket._id),
    name: ticket.name,
    type: ticket.name,
    price: Number(ticket.price || 0),
    salesStart: ticket.salesStart,
    salesEnd: ticket.salesEnd,
    maxTicketsPerUser: Number(ticket.maxTicketsPerUser || 0),
    maxPerUser: Number(ticket.maxTicketsPerUser || 0),
    maxTickets: capacity,
    available: capacity,
    sold,
    registrations: sold,
    benefits: [],
    description: "",
  };
}

export function serializeEvent(event) {
  const eventCode = event.eventCode || `EVT-${String(event._id).slice(-8).toUpperCase()}`;
  const organizer =
    event.organizer && typeof event.organizer === "object"
      ? {
          id: String(event.organizer._id || event.organizer.id || ""),
          name: event.organizer.username || "Organizer",
          email: event.organizer.email || "",
        }
      : null;

  return {
    id: String(event._id),
    _id: event._id,
    eventCode,
    eventName: event.eventName,
    title: event.eventName,
    description: event.description || "",
    longDescription: event.description || "",
    location: event.location,
    venue: event.location,
    category: event.category,
    startDate: formatDateValue(event.startDate),
    startTime: formatTimeValue(event.startTime),
    endDate: formatDateValue(event.endDate),
    endTime: formatTimeValue(event.endTime),
    date: formatDateValue(event.startDate),
    time: formatTimeValue(event.startTime),
    registrationStartDate: formatDateValue(event.registrationStartDate),
    registrationStartTime: formatTimeValue(event.registrationStartTime),
    registrationEndDate: formatDateValue(event.registrationEndDate),
    registrationEndTime: formatTimeValue(event.registrationEndTime),
    publishEvent: Boolean(event.publishEvent),
    photos: event.photos || [],
    images: event.photos || [],
    tickets: (event.tickets || []).map(serializeTicket),
    questions: event.questions || [],
    organizer,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}
