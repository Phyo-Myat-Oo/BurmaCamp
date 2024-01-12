const fetch = require('node-fetch');
const fs = require('fs');
const { createApi } = require('unsplash-js');

class Unsplash {
    constructor(accessKey) {
      this.unsplash = createApi({ accessKey, fetch });
    }
  
    async getPhotos(collection, page = 1, perPage = 30, orientation = 'landscape') {
      try {
        const response = await this.unsplash.collections.getPhotos({
          collectionId: collection,
          page: page,
          perPage: perPage,
          orientation: orientation
        });
  
        const filePaths = [];
  
        for (let i = 0; i < response.response.results.length; i++) {
          const Photo_response = response.response.results[i];
          const photoUrl = Photo_response.urls.regular;
          const photo = await fetch(photoUrl);
          const photoBuffer = await photo.arrayBuffer();
          const image = Buffer.from(photoBuffer);
  
          const filePath = `/img/${i}.jpg`;
          await fs.promises.writeFile(`public`+filePath, image);
          console.log(`${filePath} saved`);
          filePaths.push(filePath);
        }
        return filePaths;
      } catch (error) {
        console.log(error);
        throw error; // Re-throw the error
      }
    }
  }

module.exports=Unsplash;