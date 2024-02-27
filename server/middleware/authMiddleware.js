const jwt=require('jsonwebtoken')

module.exports=function(req,res,next)
{
    if(req.method==="OPTIONS"){
        next()
    }
    try{
        const token=req.headers.authorization.split(' ')[1]
        if(!token){
            console.log(1)
            return res.status(401).json({message:"Не авторизован"})
        }
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        req.user=decoded
        console.log(2)

        next()
    }
    catch(e){
         res.status(401).json({message:"Не авторизован"})

    }
}