function updateStatus(res) {
	let reqLeft = res['rate']['remaining'];
	let resetTime = res['rate']['reset'];
	let currTime = ((new Date()).getTime())/1000;
	let timeDiff = (resetTime - currTime);
	timeDiff = Math.floor(Math.floor(timeDiff)/60);

	let target = document.getElementById('refresh-status');
	if(reqLeft < 60) {
		target.innerHTML = `${reqLeft}/60 requests left. You can generate the updated stats after ${timeDiff} minutes.`;
	}
	else {
		target.innerHTML = "You can generate the updated stats now!";
	}
}

module.exports = {
	updateStatus: updateStatus
}