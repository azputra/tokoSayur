'use strict';

const User = require('../models').User;
const Item = require('../models').Item;
const checkPassword = require('../helpers/checkPassword');

class UserController {
    static getUsersAll(req, res) {
        User.findAll({})
            .then(users => {
                res.render('./adminForm/tableUser', {
                    users
                })
            })
            .catch(err => {
                res.render('users/usersError', {
                    message: err.message
                })
            })
    }

    static getUsersAdd(req, res) {
        res.render('users/signUp')
    }

    static postUsersAdd(req, res) {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const role = req.body.role;
        const email = req.body.email;
        const password = req.body.password;

        User.create({
            firstname,
            lastname,
            password,
            role,
            email
        })
            .then(() => {
                res.redirect('/users/add')
            })
            .catch(err => {
                res.render('users/usersError', {
                    message: err.message
                })
            })
    }

    static getUsersEdit(req, res) {
        const userId = req.params.id;
        User.findByPk(userId)
            .then((user) => {
                res.render('adminUser/userEdit', { user })
            })
            .catch(err => {
                res.render('users/usersError', {
                    message: err.message
                })
            })
    }

    static postUsersEdit(req, res) {
        const userId = req.params.id;
        let update = {};

        for (let key in req.body) {
            if (req.body[key].length > 0) {
                update[key] = req.body[key]
            }
        }

        User.update(update, {
            where: {
                id: userId
            }
        })
            .then(() => {
                res.redirect('/users/admin')
            })
            .catch(err => {
                res.render('users/usersError', {
                    message: err.message
                })
            })
    }

    static getUsersDelete(req, res) {
        const userId = req.params.id;

        User.destroy({
            where: {
                id: userId
            }
        })
            .then(() => {
                res.redirect('/users/admin')
            })
            .catch(err => {
                res.render('users/usersError', {
                    message: err.message
                })
            })
    }

    static getLogin(req, res) {
        if (!req.body) {
            res.redirect('/users/add');
        } else {
            Item.findAll()
                .then(items => {
                    res.render('homeLogin', { username: req.session.username, items: items })
                })
                .catch(err => {
                    res.render('users/usersError', {
                        message: err.message
                    })
                })
        }
    }

    static postLogin(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        let hashPassword;
        let users;
        let items;
        Item.findAll({})
            .then(response => {
                items = response
            })
        User.findOne({
            where: {
                username
            }
        })
            .then(user => {
                if (!user) {
                    throw new Error('username/password wrong');
                } else {
                    hashPassword = user.password;
                    if (checkPassword(password, hashPassword)) {
                        req.session.userId = user.id;
                        req.session.role = user.role;
                        req.session.username = username;
                        if (user.role == 'user' || user.role == 'admin') {
                            // next();
                            return User.findAll()
                        } else {
                            throw new Error('username/password wrong');
                        }
                    }
                }
            })
            .then(usersData => {
                users = usersData;
                if (req.session.role == 'user') {
                    res.render('homeLogin', { username: req.session.username, items })
                } else {
                    res.render('adminForm/tableUser', { users })
                }

            })
            .catch(err => {
                res.send(err.message)
            })
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/')
    }
}

module.exports = UserController;