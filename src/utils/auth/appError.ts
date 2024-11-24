class AppError extends Error {
    
    constructor(
        public message: string,
        public statusCode: number,
        public readonly isOperational = true
    ) {
        super(message)
        Error.captureStackTrace(this)
    }
}


export default AppError
