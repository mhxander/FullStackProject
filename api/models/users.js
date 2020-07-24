'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        //define requirements for User
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Please provide a unique email address'
            },
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Email address must be in standard format: mail@mail.com'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/i,
                    msg: 'Password failed to hash. Please contact the site administrator.',
                },
            },
        }
    }, {sequelize})

    //One to many correlation to courses
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: true
            }
        })
    }
    return User;
}