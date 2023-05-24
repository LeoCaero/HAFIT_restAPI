module.exports={ 
    isAlphabet: function (element){
        var alphaExp = /^[a-zA-Z\s<>\/]+$/ 
        return element.match(alphaExp) ? true : false
    },
    notEmpty: function (element) {
        return typeof element === 'string' || (typeof element ==='String') && element.length>0 ? true : false
    },
    minAndMaxCharacter: function (element, min, max){
        if (element.length >= min && element.length <= max) {
            return true
        }
        return false
    },
    isNumeric: function (element){
        var numExp = /^[0-9]+$/ 
        return element.match(numExp) ? true : false
    }
};