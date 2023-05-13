var model = require("./crud");

function setItem(queryKey, queryContent) {
  model.saveContentToDb(queryKey, queryContent);
}

function getItem(query) {
  return model.getContentFromDb(query).then((result) => {
    return result;
  });
}

function deleteItem(query) {
  return model.deleteItemFromDb(query).then(() => {});
}

function clearDB() {
  return model.clearDB().then(() => {
    return true;
  });
}

//  EXPORTS
module.exports.setItem = setItem;
module.exports.getItem = getItem;
module.exports.deleteItem = deleteItem;
module.exports.clearDB = clearDB;
