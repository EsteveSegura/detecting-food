const fs = require('fs');
const download = require('image-downloader')
const detectFood = require('./detectFood');
require('tools-for-instagram');

async function downloadPost(ig,media_id){
     try {
          let postToDownload = await getMediaIdInfo(ig,media_id);
          await downloadImage(postToDownload.items[0].image_versions2.candidates[0].url,media_id);
     } catch (error) {
          return 'cant_reads';
     }
}

async function downloadImage (url,id){
     const path = `./imgs/${id}.jpg`
     await download.image({url: url,dest: path})
     return id;
}


(async () => {
     let ig = await login();
     await setAntiBanMode(ig);
     
     setInterval(async () => {
          console.log('getin posts')
          let posts = await recentHashtagList(ig, "foodporn");
          console.log('posts done')
          console.log('interating posts')
          for(let i = 0 ; i < posts.length ; i++){
               let actualPost = await downloadPost(ig,posts[i].pk)
               let prediction = await detectFood.getPrediction(`./imgs/${actualPost}`)
               console.log(`${actualPost}.jpg : ${prediction}`)
          }
     }, 60000 /* * 75*/);

})();