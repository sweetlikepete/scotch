

const headerMiddleware = ({ xPoweredBy }) => (req, res, next) => {

    // Override this piece of shit
    res.setHeader("X-Powered-By", xPoweredBy);

    next();

};


export {
    headerMiddleware as default
};
