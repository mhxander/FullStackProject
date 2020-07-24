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
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
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
            foreignKey: {fieldName: 'userId'}
        })
    }
    return Course;
}