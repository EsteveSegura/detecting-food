const spawn = require('child_process').spawn;

function decodePrediction(str){
     let decode = str.split('-');
     return {
          "label" : decode[0],
          "percentage" : Math.trunc(decode[1])
     }
}

async function getPrediction(path){
     return new Promise((resolve,reject)=>{
          const ls = spawn('python', ['vggModel.py', path]);
          ls.stdout.on('data', (data) => {
               resolve(decodePrediction(data.toString()))
          });
     })
}

/*
(async() => {
     let prediction = await getPrediction('./imgs/testing2.jpg')
     console.log(prediction)
})();
*/

module.exports = { getPrediction }
