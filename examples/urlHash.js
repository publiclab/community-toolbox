function urlHash() {
  function getUrlHashParameter(param) {
    let params = getUrlHashParameters();
    return params[param];
  
  }
  
  function getUrlHashParameters() {
  
    let sPageURL = window.location.hash;
    if (sPageURL) sPageURL = sPageURL.split('#')[1];
    let pairs = sPageURL.split('&');
    let object = {};
    pairs.forEach(function(pair, i) {
      pair = pair.split('=');
      if (pair[0] != '') object[pair[0]] = pair[1];
    });
    return object;
  }
  
  // accepts an object like { paramName: value, paramName1: value }
  // and transforms to: url.com#paramName=value&paramName1=value
  function setUrlHashParameters(params) {
  
    let keys = Object.keys(params);
    let values = Object.values(params);
    let pairs = [];
    keys.forEach(function(key, i) {
      if (key != '') pairs.push(keys[i] + '=' + values[i]);
    });
    let hash = pairs.join('&');
    window.location.hash = hash;
  
  }
  
  function setUrlHashParameter(param, value) {
    let params = getUrlHashParameters();
    params[param] = value;
    setUrlHashParameters(params);
  
  }

  return {
    getUrlHashParameter: getUrlHashParameter,
    setUrlHashParameter: setUrlHashParameter
  }
}