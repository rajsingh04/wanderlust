const mongoose = require("mongoose");
const initData = require("./data.js");
const Mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    return mongoose.connect(Mongo_URL);
}

async function initdata(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner:'666d30631c8a401371857910',
    }));
    await Listing.insertMany(initData.data);
}

initdata();
console.log("data was intialized");