const mongoose= require('mongoose');
const dotenv=require('dotenv');
process.on('uncaughtException',err=>{
    console.log('Uncaught Error Exception !');
    console.log(err.name, err.message);
    process.exit(1);
})
dotenv.config({path:'./config.env'});

const app=require('./app');

const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true, 
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=> console.log('DB connect'));


// const testTour= new Tour({
//     name:"Dakota hills",
//     price:597,
    
// })

// testTour.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log("ERROR", err);
// });


console.log(process.env.NODE_ENV);
const port=process.env.PORT||3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
  
  process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.stack);
    server.close(() => {
      process.exit(1);
    });
  });
  
