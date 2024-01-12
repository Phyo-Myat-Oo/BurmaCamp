

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
// const Unsplash=require('./unsplash');//don't put unsplash in {}

//unsplash key and access key

const sample=array =>array[Math.floor(Math.random()*array.length)];

var description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident atque vitae perferendis est, non exercitationem, autem sint numquam doloremque nulla veritatis beatae aliquid iure, ratione facere cumque inventore blanditiis deleniti!';
const MongdbUrl= process.env.MongoDburl;
async function main() {
  try {
    await mongoose.connect(MongdbUrl);
    console.log('Mongodb connection open');
   
    // const unsplash = new Unsplash(accessKey);
    const campgroundCount = 10;
    // const filePaths = await unsplash.getPhotos(collection, 1, campgroundCount);

    await Campground.deleteMany({});

    for (let i = 0; i < campgroundCount; i++) {

      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = new Campground({
        author:'658fd19f12160d2612d8dbff',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        // image: `${filePaths[i]}`,
        images:[
          {
            url: 'https://res.cloudinary.com/dhzmrsso5/image/upload/v1704952303/BurmaCamp/hgg5w3aq4ikrt3vhy76h.jpg',
            filename: 'BurmaCamp/hgg5w3aq4ikrt3vhy76h',
          },
          {
            url: 'https://res.cloudinary.com/dhzmrsso5/image/upload/v1704952306/BurmaCamp/q8nbknjcq81bf1cuxqx0.jpg',
            filename: 'BurmaCamp/q8nbknjcq81bf1cuxqx0',
          },
        
        ],
        price: price,
        geometry:{
          type:"Point",
          coordinates:[cities[random1000].longitude,cities[random1000].latitude]
        },
        description:description
      });
      await camp.save();
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
