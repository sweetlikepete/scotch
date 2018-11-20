

const domainMiddleware = ({
    hostname,
    local
}) => (req, res, next) => {

    /*
     * Redirect all traffic to configured protocol and domain. Only do this
     * on production because we test on http and https during development.
     */
    if(
        !local &&
        (
            req.protocol !== "https" ||
            req.hostname !== hostname
        )
    ){

        res.redirect(`https://${ hostname }${ req.url }`);

        return;

    }

    next();

};


export {
    domainMiddleware as default
};
