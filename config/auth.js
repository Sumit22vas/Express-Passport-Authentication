module.exports = {
    Authentication : function(req,res,next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg","You've to login to complete this request");
        res.redirect('/');
    }
}