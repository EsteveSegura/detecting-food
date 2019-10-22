const download = require('image-downloader')
const detectFood = require('./detectFood');

//read txt file and convert to array
function readFileLineByLine(dataPath){
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

//download instagram post
async function downloadPost(ig,media_id){
     try {
          let postToDownload = await getMediaIdInfo(ig,media_id);
          let downloadedData = await downloadImageFromUrl(postToDownload.items[0].image_versions2.candidates[0].url,media_id);
          return downloadedData;
     } catch (error) {
          return 'cant_read';
     }
}

//Random int
function randomInt(min,max){
     return Math.round(Math.random() * (max-min)+ min)
}

//use package image-downloader for downloading images from the internet
async function downloadImageFromUrl (url,id){
     const path = `./imgs/${id}.jpg`;
     await download.image({url: url,dest: path});
     return id;
}

//this way can call python vggModel.py
async function getPrediction(path){
     let pred = await detectFood.getPrediction(path);
     return pred;
}


//instagram workflow
(async () => {
     let ig = await login(); //login
     await setAntiBanMode(ig); //anti-ban Mode
     
     //repeat this every hour
     setInterval(async () => {
          let posts = await recentHashtagList(ig, "foodporn"); //get all hashtags in #foodporn hashtag
          for(let i = 0 ; i < posts.length ; i++){
               let actualPost = await downloadPost(ig,posts[i].pk) //download picture
               if(actualPost != "no_preds"){
                    try {
                         let prediction = await detectFood.getPrediction(`./imgs/${actualPost}.jpg`) //try to predict
                         console.log(`the media id: ${actualPost} is ${prediction.label} in ${prediction.percentage}.00%`) 
                         if(prediction.label == "cheeseburger" && prediction.percentage >= 85){
                              let sentences = readFileLineByLine('./burgerSentences.txt');
                              let randomSentence = sentences[randomInt(0,sentences.length-1)]
                              commentMediaId(ig, actualPost, randomSentence)
                              console.log("Comment that picture!")
                         }
                    } catch (error) {
                         console.log("this is not a picture")
                    }
               }
          }
     }, 60000);
})();