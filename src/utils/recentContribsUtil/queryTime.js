function findMonthInd (queryTime) {
  const timeNow = new Date();
  const qTime = new Date(`${queryTime}`);
  const diff = timeNow - qTime;
  let monthsBack;
  if (diff > 60e3) {
    monthsBack = Math.floor((Math.floor(diff / 60e3)) / (60 * 24 * 30));
  }

  return monthsBack;
}

module.exports = {
  findMonthInd: findMonthInd
};
