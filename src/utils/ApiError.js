class ApiError extends Error{
    constructor(
        statuscode,
        messgae = "Something went wrong",
        errors =[],
        statck =""
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.messgae = messgae
        this.success = false
        this.errors = errors

        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export { ApiError }