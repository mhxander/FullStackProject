const { body, validationResult } = require('express-validator');

//First, check for any empty fields
const userRules = () => {
    return [
        body('firstName')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Please provide a value for "firstName"'),
    
        body('lastName')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Please provide a value for "lastName"'),
    
        body('emailAddress')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Please provide a value for "emailAddress"'),
    
        body('password')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Please provide a value for "password"'),
    ];
};
  
const courseRules = () => {
    return [
        body('title')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Please provide a value for "title"'),
        body('description')
            .exists({ checkNull: true, checkFalsy: true })
            .withMessage('Please provide a value for "description"'),
    ];
};

//Send out appropriate errors from info above
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = [];
        errors.array().map((err) => errorMessage.push({ [err.param]: err.msg }));
    
        return res.status(400).json({
            errors: errorMessage,
        });
    } else {
        return next();
    }
};
  
module.exports = {
    userRules,
    courseRules,
    validate,
};