const express=require("express")
const app=express();
const cors=require("cors");
const fooditemRoutes=require("./routes/fooditemRoute")
const connectdb=require("./config/db")
const userRoutes=require("./routes/userRoute");
const cartRoute=require("./routes/cartRoute");
const orderRoutes=require("./routes/orderRoutes");
const port=process.env.port;

connectdb();
app.use(express.json());
app.use(cors());

app.use('/api/food',fooditemRoutes);
app.use('/api/user',userRoutes)
app.use('/api/cart',cartRoute)
app.use('/api/order',orderRoutes);



app.get('/',(req,res)=>{
    res.send("server is running healthy");
})


app.listen(port,()=>{
    console.log(`server is running at this port ${port} `)
})