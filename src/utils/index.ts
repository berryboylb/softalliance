export * from "./types"

export function convertDateFormat(inputDate: string): string {
  const dateObject = new Date(inputDate);

  // Format the date as "DD - MM - YYYY"
  const formattedDate = `${dateObject.getDate()} - ${dateObject.getMonth() + 1} - ${dateObject.getFullYear()}`;

  // Format the time as "HH:MM AM/PM"
  const hours = dateObject.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = dateObject.getMinutes();
  const ampm = dateObject.getHours() < 12 ? 'AM' : 'PM';
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

  return `${formattedDate} || ${formattedTime}`;
}

export function convertDateFormatOnly(inputDate: string): string {
  if (!inputDate)  return "N/A"
  const dateObject = new Date(inputDate);

  // Format the date as "DD - MM - YYYY"
  const formattedDate = `${dateObject.getDate()} - ${
    dateObject.getMonth() + 1
  } - ${dateObject.getFullYear()}`;

  return `${formattedDate}`;
}


export const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  const message = "Are you sure you want to leave?";
  event.returnValue = message;
  return message;
};
