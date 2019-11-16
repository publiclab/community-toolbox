// Utility function that checks if a given date is behind the current date
// by 7 or less
function withinMonths (date, months) {
  const current = new Date().getTime();
  const pastDate = new Date(`${date}`).getTime();
  const measure = Math.ceil(Math.abs(current - pastDate) / (1000 * 3600 * 24));
  const lim = 30 * months;
  if (measure <= lim) {
    return true;
  }
  return false;
}

// EXPORTS
module.exports = {
  withinMonths: withinMonths
};
