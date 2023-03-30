module.exports={ 
  isAlphabet: function (element){
    var alphaExp = /^[a-zA-Z]+$/;
    return element = element.match(alphaExp) ? true : false; 
  }
};