function findMonthInd(queryTime) {
    let timeNow = new Date();
    let qTime = new Date(`${queryTime}`);
    let diff = timeNow - qTime;
    let monthsBack;
    if (diff > 60e3) {
        monthsBack = Math.floor((Math.floor(diff / 60e3))/(60*24*30));
    }
    
    return monthsBack;
}
  

module.exports = {
	findMonthInd: findMonthInd
}