module.exports = {
    adminRightsCheck: function (req, res, next) {
        if (req.session.user && req.session.user.isAdmin) {
            console.log('adminRightsCheck: OK');
            next();
        } else {
            req.session.errorMessage = "You don't have admin rights! You have been reported to the system administrator!";
            res.redirect('/cars/list');
        }
    },
}