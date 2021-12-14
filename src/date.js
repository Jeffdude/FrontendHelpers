// returns now + timedelta (string, e.g. 2d, 3h, etc)
export function getDateAfter(timedelta){
  const now = Date.now()
  let unit = timedelta.charAt(timedelta.length - 1);
  let amount = parseInt(timedelta.slice(0, -1));
  switch( unit ) {
    case 'd': {
      return now + (amount * 1000 * 60 * 60 * 24);
    }
    case 'h': {
      return now + (amount * 1000 * 60 * 60);
    }
    case 'm': {
      return now + (amount * 1000 * 60);
    }
    case 's': {
      return now + 1000 * amount;
    }
    default: {
      return now + amount;
    }
  }
}

export function hasExpired(date){
  return (date <= Date.now());
}

// true within 24 hours of auth expiration
export function needsRefresh(date){
  return ((date - Date.now()) <= 24 * 60 * 60 * 1000)
}

export function ISOToReadableString(ISOString) {
  const date = new Date(ISOString);
  return date.toLocaleString();
}
