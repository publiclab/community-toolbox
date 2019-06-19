function showFilteredData(org, type, response) {
    if (type==="alphabetic") {
        response.sort(function(x, y) {
            if ((x.author.login).toLowerCase() > (y.author.login).toLowerCase()) {
                return 1;
            }else {
                return -1;
            }
        });
        return response;
    }
    else if(type==="mostrecentfirst") {
        response.sort(function (x,y) {
            let a = new Date(x.commit.author.date);
            let b = new Date(y.commit.author.date);
            if(b>a) {
                return 1;
            }else {
                return -1;
            }
        })
        return response;
    }
}



module.exports = {
    showFilteredData: showFilteredData
}