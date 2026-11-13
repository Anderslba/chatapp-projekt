function isAuthorized(minLevel = 1) {
    return function(req, res, next) {
        if (req.session.userid && req.session.userLevel) {
            if (Number(req.session.userLevel) >= minLevel) {
                return next();
            }
        }
        return res.status(403).redirect('/login');
    }
}

export { isAuthorized }