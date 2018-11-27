var model = require('./index');


function setItem(queryKey, queryContent) {
    model.saveContentToDb(queryKey, queryContent);
    return;
}

function getItem(query) {
    console.log("In getItem");
    return model.getContentFromDb(query).then((result) => {
        console.log('In getItem, result = ', result);
        return result;
    });
}

function deleteItem(query) {
    return model.deleteContentFromDb(query).then(() => {
        console.log("Deleted item.");
        return;
    })

}



//  EXPORTS
module.exports = {
    setItem: setItem,
    getItem: getItem,
    deleteItem: deleteItem,
}