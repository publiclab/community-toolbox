var model = require('./index');


function setItem(queryKey, queryContent) {
    model.saveContentToDb(queryKey, queryContent);
    return;
}

function getItem(query) {
    return model.getContentFromDb(query).then((result) => {
        return result;
    });
}

function deleteItem(query) {
    return model.deleteItemFromDb(query).then(() => {
        return;
    })

}



//  EXPORTS
module.exports = {
    setItem: setItem,
    getItem: getItem,
    deleteItem: deleteItem,
}