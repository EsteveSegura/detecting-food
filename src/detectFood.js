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
     //let prediction = await getPrediction('./imgs/testing2.jpg')
     let prediction = await getPrediction('https://scontent-mad1-1.cdninstagram.com/vp/398d97fc45103ad822d4a7ab6b4ccc8f/5E30FB0A/t51.2885-15/e35/71297284_429622957728811_8164393986194082260_n.jpg?_nc_ht=scontent-mad1-1.cdninstagram.com&_nc_cat=107')
     console.log(prediction)
})();
*/

module.exports = { getPrediction }
