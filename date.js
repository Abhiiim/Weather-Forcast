// Two ways of Exporting Module

module.exports.getDate = getDate;

function getDate(){

  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  let today  = new Date();
  return today.toLocaleDateString("en-US", options);
}

exports.getTime = function (){

  let options = {
    hour: '2-digit',
    minute: '2-digit'
  }

  let today  = new Date();
  return today.toLocaleTimeString("en-US", options);
  // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // return time;
}

exports.getApiKey = function(){
  const appKey = "1b2524ed520e1c658ec83fd4b04a8325";
  return appKey;
}
