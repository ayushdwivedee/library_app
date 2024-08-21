const checkRole=(givenRoles)=>{
    return (req,res,next)=>{
        const role=req.user.roles
        if(givenRoles.includes(role)){
            next()
        }else{
            return res.status(501).json({msg:"You are not authorized to access this route"})
        }
    }
}

module.exports=checkRole