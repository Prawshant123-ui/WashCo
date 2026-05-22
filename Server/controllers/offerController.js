
// Create Offer
const Offer=require('../models/offerModel')

const createOffer=async(req,res)=>{
    try {
        const offer=await Offer.create(req.body)

        res.status(201).json(offer)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//Read All Offer with pagination 

const getAllOffer=async(req,res)=>{
    try {
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) ||10;
        const skip=(page-1)*limit;

        const total=await Offer.countDocuments()

        const offer=await Offer.findOne({isActive:true}).skip(skip).limit(limit).sort({createdAt:-1})

        res.json({
            page,totalPages : Math.ceil(total/limit),offer
        })
    } catch (error) {
         res.status(500).json({
            message: error.message
        });
    }
}

//Read Single offer

const getSingleOffer=async(req,res)=>{
try {
    const offer=await Offer.findById(req.params.id)
     
    if(!offer){
        res.status(404).json({message:"Thers's no any offer"})
    }

    res.json(offer)
} catch (error) {
     res.status(500).json({
            message: error.message
        });
}
}

//Update offer

const updateOffer=async(req,res)=>{
    try {
        const offer=await Offer.findById(req.params.id)

        if(!offer){
              res.status(404).json({message:"Thers's no any offer"})
        }

        Object.assign(offer,req.body)

        const updated=await offer.save()

        res.json(updated)


    } catch (error) {
         res.status(500).json({
            message: error.message
        });
    }
}

//Delete Offer

const deleteOffer=async(req,res)=>{
    try {
        const offer=await Offer.findById(req.params.id)

        if(!offer){
              res.status(404).json({message:"Thers's no any offer"})
        }

        await offer.deleteOne()

        res.json({message:"Offer deleted!!"})
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.module={createOffer,getAllOffer,getSingleOffer,updateOffer,deleteOffer}