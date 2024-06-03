let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "Facial",
    start: todayStr + "T14:36:00",
  },
  {
    id: createEventId(),
    title: "Massage",
    start: "2024-06-02T14:00:00", 
  },
];

export function createEventId() {
  return String(eventGuid++);
}
