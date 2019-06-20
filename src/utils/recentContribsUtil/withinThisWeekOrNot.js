// Utility function that checks if a given date is behind the current date
// by 7 or less
function within_this_week(date) {
    let current = (new Date).getTime();
    let past_date = (new Date(`${date}`)).getTime();
    let measure = Math.ceil(Math.abs(current - past_date) / (1000*3600*24));
    if(measure<=7) {
        return true;
    }
    return false;
}


// EXPORTS
module.exports = {
	within_this_week: within_this_week
}