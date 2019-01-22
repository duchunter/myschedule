// Parse string to int

export default function parseDuration(str) {
  let arr = str.split(':');
  if (arr.length != 2) {
    return -1;
  }

  let hour = parseInt(arr[0]);
  let minute = parseInt(arr[1]);

  if (isNaN(hour) || isNaN(minute)) {
    return -1;
  }

  hour = Math.max(0, hour);
  hour = Math.min(hour, 2);
  minute = Math.max(0, minute);
  minute = Math.min(minute, 59);

  return hour * 60 + minute;
}
