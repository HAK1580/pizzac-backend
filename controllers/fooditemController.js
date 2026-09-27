const fooditem=require("../models/fooditemSchema");
const fooddeals=require("../models/dealsSchema")
const createfood=( async (req,res)=>{
         const{name,price}=req.body;
     try{
         const new_item= await  fooditem.create({name,price})
         res.status(200).json({message:"new item added",new_item})
       
     }catch(err){
        res.json({message:"error occured"});
     }
})


const getfooditems=(async(req,res)=>{
    try{
     const saved_food=await fooditem.find()
     res.status(200).json({message:"total food in the inventory",saved_food})

    }catch(err){
        console.log(err)
    }
})


const getdeals=(async(req,res)=>{

    try{
  
        const deals=await fooddeals.find();
        if(!deals){
            return res.status(404).json({message:" deals not found"})
        }
        res.status(200).json({message:"best deals",deals})

    }
    catch(err){
        res.status(404).json({message:"server err",err})
    }
    
})

module.exports={createfood,getdeals,getfooditems}