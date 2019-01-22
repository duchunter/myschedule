// Return duration string
export default function getDuration(duration) {
  if (duration == 0) {
    return 'Inactive';
  }

  let hours = Math.floor(duration / 60);
  let minutes = duration % 60;

  return (hours != 0 ? hours + ' hours ' : '')
    + (minutes ? minutes + ' minutes' : '');
}
