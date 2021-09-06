'use strict'

const express = require('express');
const {check, validationResult} = require('express-validator');
// const middleware = require('./middleware');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const {models} = require('./models');

//set up router
const router = express.Router();

//set up models
const {User} = require('./models');
const {Course} = require('./models');


//async handler
function asyncHandler(cb) {
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch (error) {
            next (error)
        }
    }
}

//Authenticate User

const authenticateUser = asyncHandler(async(req, res, next) => {
    let message = null;
    const credentials = auth(req);

    //Check if credentials are preset
    if (credentials) {
    const user = await User.findOne({
        where: {
        emailAddress: credentials.name,
        }
    })

    if (user) {
        const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
        // check if passwords match
        if (authenticated) {
        // Then store user on the request object so it's accessible
        req.currentUser = user;
        } else {
        message = `Authentication failure for email: ${user.emailAddress}`;
        }
    } else {
        message = `User not found for name: ${credentials.name}`;
    }
    } else {
    message = 'Auth header not found';
    }
    // If user authentication failed...
    if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
    } else {
    // If it succeeded, go to next
    next();
    }
});

//User routes

//Get Users
router.get('./users', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser

    res.json({
        Id: user.id,
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.emailAddress
    });
    res.status(200).end();
}));

//Post New Users
router.post('./users', [
    check('firstName')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide your first name'),
    check('lastName')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide your last name'),
    check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide your email address')
    .isEmail()
    .withMessage('Please provide a valid email address'),
    check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a password')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a password that is between 8 and 20 characters in length'),
], asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    const user = req.body;

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({errors: errorMessage});
    }

    //Validate email is unique
    const existingEmail = await User.findOne({
        where: {
            emailAddress: req.body.emailAddress
        }
    })

    if (existingEmail) {
        res.status(400).json({message: "Email already in Use"})
    }


    //Hash Password
    if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
    }

    try {
        await User.create(user);
        res.location(`/`);
        res.status(201);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).location('/').json({ error: error.errors[0].message })
        } else {
            throw error
        }
    }
}));



//Course Routes

//Get Courses
router.get('/course', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    });
    if(courses) {
        res.json(courses)
        res.status(200).end();
    } else {
        res.status(404).json({message: "No courses found"})
    }
}))

//Get Individual Course
router.get("/courses/:id", asyncHandler(async(req, res) => {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId, {
        include: {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    })

    if (course) {
        res.json(course)
        res.status(200).end();
    } else {
        res.status(404).json({ message: "Couldn't find course with that ID" })
    }
}))

//Create Courses
router.post('/courses', [
    check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a Title'),
    check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a Description'),
    check('userId')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a UserID'),
], authenticateUser, asyncHandler(async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages });
    } else {
        const course = await Course.create(req.body);
        const courseId = course.dataValues.id
        res.status(201).location(`/courses/${courseId}`).end();
    }
}));

//Update Course if Authorized
router.put('/courses/:id', [
    check("title")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a Title'),
    check("description")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a Description'),
], authenticateUser, asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    const user = req.currentUser.dataValues.id;
    const course = await Course.findbyPk(req.params.id, {
        include: {
            model: User,
            as: "user",
        },
        attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded"]
    })

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    };

    if (course.dataValues.userId === user) {
        const updated = await course.update(req.body);
        if (updated) {
            res.status(204).end();
        } else {
            res.status(403).json({message: "You are not authorized"})
        }
    } else {
        res.status(404).json("No courses found to update");
    };
}));

//DELETE individual course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const course = await models.Course.findByPk(req.params.id);
    const user = req.currentUser.dataValues.id;
    if (course) {
        if (course.dataValues.userId === user) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json("User doesn't have authorization to delete this course");
        };
    } else {
        res.status(404).json({message: "No Courses found to delete"})
    }
}));

module.exports = router;
