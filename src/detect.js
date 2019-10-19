const spawn = require('child_process').spawn;
const ls = spawn('python', ['vgg.py', './imgs/testing2.jpg']);

function decodePrediction(str){
     let decode = str.split('-');
     return {
          "label" : decode[0],
          "percentage" : Math.trunc(decode[1])
     }
}

async function callPython(){
     return new Promise((resolve,reject)=>{
          ls.stdout.on('data', (data) => {
               resolve(decodePrediction(data.toString()))
          });
     })
}

(async() => {
     let prediction = await callPython()
     console.log(prediction)
})();

