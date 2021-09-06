'user strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model{}
    Course.init({
        //define requirements for Course
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            VALIDATE: {
                notEmpty: {
                    msg: "Please provide a Title"
                },
                allowNull: false
            }
        },
        description: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: {
                    msg: "Please provide a description"
                },
                allowNull: false
            }
        }, 
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {sequelize})

    //one to one with "userId"
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {fieldName: 'userId', allowNull: false}
        })
    }
    return Course;
}