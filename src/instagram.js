const fs = require('fs');
const download = require('image-downloader')
const detectFood = require('./detectFood');
require('tools-for-instagram');

//read txt file and convert to array
function readFileLineByLineAndConvertToArray(dataPath){
     return new Promise(function(resolve,reject){
         let dataset = []
 
         let rl = readline.createInterface({
             input: fs.createReadStream(dataPath)
         });
         
         rl.on('line', function(line) {
             dataset.push(line)
         });
         
         rl.on('close', function(line) {
             resolve(dataset)
         });
     })
 }

async function downloadPost(ig,media_id){
     try {
          let postToDownload = await getMediaIdInfo(ig,media_id);
          let downloadedData = await downloadImageFromUrl(postToDownload.items[0].image_versions2.candidates[0].url,media_id);
          return downloadedData;
     } catch (error) {
          return 'cant_reads';
     }
}

async function downloadImageFromUrl (url,id){
     const path = `./imgs/${id}.jpg`
     await download.image({url: url,dest: path})
     return id;
}

async function getPrediction(path){
     let pred = await detectFood.getPrediction(path)
     return pred
}

(async () => {
     let ig = await login();
     await setAntiBanMode(ig);
     
     //setInterval(async () => {
          let posts = await recentHashtagList(ig, "foodporn");
          console.log(posts.length)
          for(let i = 0 ; i < posts.length ; i++){
               let actualPost = await downloadPost(ig,posts[i].pk)
               if(actualPost != "no_preds"){
                    try {
                         let prediction = await detectFood.getPrediction(`./imgs/${actualPost}.jpg`)
                         console.log(`the media id: ${actualPost} is ${prediction.label} in ${prediction.percentage}.00%`)
                         if(prediction.label == "cheeseburger" && prediction.percentage >= 85){
                              console.log("Comment that picture!")
                         }
                    } catch (error) {
                         //console.log("sad")
                    }
               }
          }
     //}, 600000 /* * 75*/);

})();