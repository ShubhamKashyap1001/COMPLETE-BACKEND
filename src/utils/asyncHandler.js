const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
                .catch((err) => next(err));
    }
}

export {asyncHandler}



//const asyncHandler = () => {}
//const asyncHandler = (fn) => () => {}
//const asyncHandler = (func) => async() => {}


//METHOD-2

// const asyncHandler = (func) => async(req,res,next) => {
//     try{
//         await func(req,res,next);
//     }catch(error){
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message,
//         })
//     }
// }