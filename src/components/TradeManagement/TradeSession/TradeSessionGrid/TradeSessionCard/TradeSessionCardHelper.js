export const formatDuration = (durationInMinutes) => {
    if (durationInMinutes === 0) {
        return '0m';
    }

    const days = Math.floor(durationInMinutes / 1440);
    const hours = Math.floor((durationInMinutes % 1440) / 60);
    const minutes = durationInMinutes % 60;

    let durationString = '';
    if (days > 0) {
        durationString += `${days}d `;
    }
    if (hours > 0 || (days > 0 && minutes > 0)) {
        durationString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
        durationString += `${minutes}m`;
    }

    return durationString.trim();
};



export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

export const calculateDuration = (started_at, closed_at) => {
    const startDate = new Date(started_at);
    const endDate = closed_at ? new Date(closed_at) : new Date();
    const duration = endDate - startDate;
    return formatDuration(Math.floor(duration / 1000 / 60)); // returns duration in minutes
  };