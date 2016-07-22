const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const _ = require('lodash');

const fs = require('fs');
const util = require('util');
const log_file = fs.createWriteStream('log.js', { flags: 'w' });
const log_stdout = process.stdout;

console.log = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

var date = new Date();
var sdate, uri;
var time = '1700';  // this does not matter , cause they are returning all availible
var flag = true;
var quantity = 2;
var count = 0;

(function recursive(flag) {
  if(!flag){
    return;
  }

  sdate = date.toISOString().substring(0,10);
  uri = `https://www.yelpreservations.com/r/din-tai-fung-santa-clara/?date=${sdate}&time=${time}&duration=&covers=2`;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', uri, true);
  xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log('inside response counter is');
        // console.log(count);
        console.log(date);
        const response = JSON.parse(xmlhttp.responseText);
        _.forEach(response.slots, (value, key) => {
          if(!_.isEmpty(value)){
            _.forEach(value, (v, k) => {
              if(v.quantity >= quantity){
                console.log(key);
                console.log(v);
                count +=1;
              }
            });
          }
        });
        date.setDate(date.getDate()+4);
        recursive(count<20);
       }
  };
  xmlhttp.send();
})(flag)
