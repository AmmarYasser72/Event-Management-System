export function buildBookingQrValue(eventCode, bookingId, qrToken) {
  return `EVENTX|${eventCode || "EVENT"}|${bookingId}|${qrToken}`;
}

export function extractQrToken(value) {
  if (!value) {
    return "";
  }

  const raw = String(value).trim();
  if (!raw.includes("|")) {
    return raw;
  }

  const parts = raw.split("|");
  return parts[parts.length - 1] || "";
}
