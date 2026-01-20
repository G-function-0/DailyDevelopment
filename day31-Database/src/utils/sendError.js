export const sendError = (res, code, message) => {
    return res.status(code).json({
        success: false,
        message,
    });
};