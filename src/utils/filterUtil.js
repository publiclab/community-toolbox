function showFilteredData (org, type, response) {
  if (type === 'alphabetic') {
    response.sort(function (x, y) {
      if (x.author.login.toLowerCase() > y.author.login.toLowerCase()) {
        return 1;
      } else {
        return -1;
      }
    });
    return response;
  } else if (type === 'mostrecentfirst') {
    response.sort(function (x, y) {
      const a = new Date(x.commit.author.date);
      const b = new Date(y.commit.author.date);
      if (b > a) {
        return 1;
      } else {
        return -1;
      }
    });
    return response;
  } else if (type === 'leaderboard') {
    const leaderMap = new Map([]);

    response.map(function mappingToCommiters (dataItem, i) {
      let temp = leaderMap.get(dataItem.author.login);
      if (temp < 0 || temp === undefined || temp == null) {
        temp = 0;
      }
      temp += 1;
      leaderMap.set(dataItem.author.login, temp);
    });

    const sortedMap = new Map(
      [...leaderMap.entries()].sort((a, b) => b[1] - a[1])
    );
    return sortedMap;
  }
}

module.exports = {
  showFilteredData: showFilteredData
};
