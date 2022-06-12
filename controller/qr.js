const Restaruant = require("../model/restaruant");
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const QRCode=require("qrcode");


exports.qrCode=BigPromise(async(req,res,next)=>{
    const {email} =req.body
    
    const restaraunt =await Restaruant.findOne({email})
    const Qid=restaraunt._id.toString()
    let id=restaraunt._id.toString()
    const table=restaraunt.table
    // console.log(table)

    //generateqrcode
    const qrCode=[]
    for(let i=1;i<=table;i++){
       

        id=id+1;
        // QRCode.toDataURL(id, ( err, url) => {})
        QRCode.toString(id,{type:'terminal'}, function (err, url) {
            
            qrCode.push(url)
          })
        
    }

  
   
    await Restaruant.findByIdAndUpdate(Qid,{qrCode

    },{
        new:true,
        runVallidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        sucess:true,
    })
})

