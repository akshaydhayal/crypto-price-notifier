import mongoose from "mongoose";

const alertSchmea=new mongoose.Schema({
    token:{type:String,required:true},
    symbol:{type:String,required:true},
    email:{type:String,required:true},
    targetPrice:{type:Number,required:true},

})

export const alertModel=mongoose.models.alertModel || mongoose.model('alertModel',alertSchmea);