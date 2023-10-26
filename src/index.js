import app from "./app";
import mongoose from "mongoose";

mongoose.set("strictQuery", false)
mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Db Connection Well");
    })
   .catch((err)=> console.log(err))

   const PORT = process.env.PORT || 4100;

   app.listen(process.env.PORT, ()=>{
    console.log(`Server running on PORT: http://localhost:${PORT}`);
   });