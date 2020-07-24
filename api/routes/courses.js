const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;

//Import from other files
const {courseRules, validate} = require ('./expressVal');
const authUser = require('./authUser');

// async handler
function asyncHandler(cb) {
    return async(req, res, next) => {
        try{
            await cb(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

//GET request for all courses
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{ model: User, attributes: ['firstName', 'lastName', 'emailAddress'] }]
    });
    res.json({ courses });
}));

//GET request for one course
router.get('/:id', asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(404).json({ message: `Course ID: ${id} not valid` });
    } else {
        const course = await Course.findByPk(id, {
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
            include: [{ model: User, attributes: ['firstName', 'lastName', 'emailAddress'] }]
        });
        if (!course) {
            res.status(404).json({ message: `Course ID: ${id} not valid` });
        } else {
            res.json({ course });
        }
    }
}));

//POST a new course
router.post('/', authUser, courseRules(), validate, asyncHandler(async (req, res) => {
    const newCourse = req.body;
    try {
        const course = await Course.create({
            title: newCourse.title,
            description: newCourse.description,
            estimatedTime: newCourse.estimatedTime,
            materialsNeeded: newCourse.materialsNeeded,
            userId: req.currentUser.id
        });
        res.location(`/api/courses/${course.id}`);
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errorMessage = [];
            error.errors.map((err) => errorMessage.push(err.message));
            return res.status(400).json({
            errors: errorMessage,
            });
        } else {
            throw error;
        }
    }
}));

//PUT route to edit a course
router.put('/:id', authUser, courseRules(), validate, asyncHandler(async (req, res) => {
    const updateCourse = req.body;
    const {id} = req.params;
    if (isNaN(id)) {
        res.status(404).json({ message: `Course ID: ${id} not valid` });
    } else {
        const course = await Course.findByPk(id, {
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
            include: [{ model: User, attributes: ['firstName', 'lastName', 'emailAddress'] }],
        });
        if (!course) {
            res.status(404).json({ message: `Course ID: ${id} not valid` });
        } else if (course.userId !== req.currentUser.id) {
            res.status(403).json({ message: `User is not the owner of course ID: ${id}` });
        } else {
            await course.update({
            title: updateCourse.title,
            description: updateCourse.description,
            estimatedTime: updateCourse.estimatedTime,
            materialsNeeded: updateCourse.materialsNeeded
            });
            res.status(204).end();
        }
    }
}));

//DELETE a course
router.delete('/:id', authUser, asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(404).json({ message: `Course ID: ${id} not valid` });
    } else {
        const course = await Course.findByPk(id);
        if (!course) {
            res.status(404).json({ message: `Course ID: ${id} not valid` });
        } else if (course.userId !== req.currentUser.id) {
            res.status(403).json({ message: `User is not the owner of course ID: ${id}` });
        } else {
            await course.destroy();
            res.status(204).end();
        }
    }
}));

module.exports = router