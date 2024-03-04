class ExpressError extends Error{

    
    constructor(status, message){
        super(status);
        // this.status = status;
        this.message= message;

    }
}

module.exports= ExpressError;