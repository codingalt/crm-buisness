export const extractErrors = (errors) => {
  if (errors) {
    const errorsArray = Object.keys(errors).reduce((acc, key) => {
      return acc.concat(errors[key]);
    }, []);
    return errorsArray;
  }
};

// Format Time 
export const formatTime = (time) => {
  if (time > 0) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `00:00`;
  }
};


// Truncate Text 
export const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}..` : text;
};
