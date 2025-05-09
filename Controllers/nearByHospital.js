const HospitalModels = require('../Models/nearByHospital');

exports.addNearByHospital = async(req,res)=>{
    try{
        const {name,address,contact} = req.body;
        const hospital = new HospitalModels({name,address,contact,addedBy:req.user?._id});
        await hospital.save();
        res.status(200).json({message:"Hospital Added Successfully",hospital})
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.getHospitals = async(req,res)=>{
    try{
        const hospitals = await HospitalModels.find().populate("addedBy").sort({createdAt:-1});
        res.status(200).json({
            message:"Hospitals Fetched Successfully",
            hospitals
        })
    }catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.getHospitalById= async(req,res)=>{
    try{
        const {id} = req.params;
        const hospital = await HospitalModels.findById(id);
        if(hospital){
            return res.status(200).json({
                message:"Hospital Fetched Successfully",
                hospital
            });
        }

        return res.status(400).json({
            error:"No Such Hospital Found"
        });

    }catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}


exports.updateHospitalById = async(req,res)=>{
    try{
        const {id} = req.params;
        let body = {...req.body};
        

        const hospital = await HospitalModels.findByIdAndUpdate(id,{...body,addedBy:req.user?._id});
        if(hospital){
            return res.status(200).json({
                message:"Hospital Updated Successfully",
            });
        }

        return res.status(400).json({
            error:"No Such Hospital Found"
        });

    }catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.deleteHospitalById =  async(req,res)=>{
    try{
        const {id} = req.params;
        const hospital = await HospitalModels.findByIdAndDelete(id);
        if(hospital){
            return res.status(200).json({
                message:" Deleted Successfully",
            });
        }

        return res.status(400).json({
            error:"No Such Hospital Found"
        });

    }catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}
