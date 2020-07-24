const User = require('../models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Authentication function
const authenticate = async(req, res, next) => {
    const credentials = auth(req);
    let authMessage = null;
    if (credentials) {
        const user = await User.findOne({
            where: {emailAddress: credentials.name}
        });
        if (user) {
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            if (authenticated) {
                req.currentUser = user;
            } else {
                res.status(401);
                authMessage = 'Authentication failed-no match';
            }
        } else {
            res.status(401);
            authMessage = 'Authentication failed-no user with that email address';
        }
    } else {
        res.status(401);
        authMessage = 'No authorization credentials available.';
    }
    if (authMessage) {
        console.warn(authMessage);
        res.json({message: `Access Denied: ${authMessage}`});
    } else {
        next();
    }
};

module.exports = authenticate;