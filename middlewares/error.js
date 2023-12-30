module.exports = (err, req, res, next) => {
    // format errors
    let status = 500
    let message = "Internal server error"
    if ((err.status) && (err.status != 500)) {
        message = err.message
        status = err.status
    }
    console.error(err)
    res.status(status).json({
        message: message,
        errors: err.errors,
    });
}