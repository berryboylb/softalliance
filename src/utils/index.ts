export * from "./types"

export function formatDateTime(dateTimeString: Date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString("en-US", options);
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour12: true,
  });

  return `${formattedDate} || ${formattedTime}`;
}