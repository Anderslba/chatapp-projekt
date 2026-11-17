function isAuthorized(minLevel = 1) {
    return function(req, res, next) {
        if (req.session.userId && req.session.userLevel) {
            if (Number(req.session.userLevel) >= minLevel) {
                return next();
            }
        }
        return res.redirect('/login');
    }
}

export { isAuthorized }