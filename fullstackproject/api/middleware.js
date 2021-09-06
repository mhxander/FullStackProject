const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const {models} = require('./models');

const {User} = models;


//Unique Email function

const isUniqueEmail = async(user) => {
    const users = await User.findAll({attributes: ["emailAddress"], raw: true});
    const userEmails = user.map(user => user.emailAddress);
    const uniqueEmail = userEmails.find(email => email === user.emailAddress);

    if(uniqueEmail) {
        return false;
    } else {
        return true;
    }
}

//Authenticate User

const authenticateUser = async(req, res, next) => {
    try{
        let message = null;

        const credentials = auth(req);

        if (credentials) {
            const user = await User.findOne({
                where: {emailAddress: credentials.name}
            });

            if (user) {
                const authenticated = bcryptjs
                    .compareSync(credentials.pass, user.password);
                
                if (authenticated) {
                    console.log("authenticated");
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for email: ${User.emailAddress}`;
                };
            } else {
                message = `User not found: ${credentials.name}`;
            }
        } else {
            message = "Auth header not found"
        };


        if (message) {
            console.warn(message);
            res.status(401).json({message: "Access Denied"});
        } else {
            next();
        };
    } catch (error) {
        throw error;
    };
};


function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    };
};


module.exports = (authenticateUser, isUniqueEmail, isEmpty);