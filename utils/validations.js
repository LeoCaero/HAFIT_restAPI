module.exports={ 
    isAlphabet: function (element){
        var alphaExp = /^[a-zA-Z\s]+$/ 
        return element.match(alphaExp) ? true : false
    }
};