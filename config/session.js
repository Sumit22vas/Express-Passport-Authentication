module.exports = {
    ValidateSession : function(req,res,next) {
        if(req.user) {
            res.redirect('/dashboard');
        } else {
            next();
        }
    }
}