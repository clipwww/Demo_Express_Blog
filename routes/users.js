require('../lib/db.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model("Blog");
var Comment = mongoose.model("Comment");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render('./users/register', { title: 'Register' });
});

router.get('/signin', function(req, res, next) {
    if (req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render('./users/signin', { title: 'Log In' });
});

router.get('/signout', function(req, res, next) {
    req.session.logined = false;
    res.redirect('/');
    res.end();
});

router.get('/forget', function(req, res, next) {
    res.send("This is the forgot page.");
});

router.get('/profile', function(req, res, next) {
    if (!req.session.logined) {
        res.redirect('/');
        return;
    };
    res.locals.username = req.session.name;
    res.locals.authenticated = req.session.logined;
    Blog.find({ Username: req.session.name }, function(err, blogs, count) {
        res.render('./users/profile', {
            title: 'Profile',
            blogs: blogs
        })
    });
});

router.get('/add_article', function(req, res, next) {
    res.locals.username = req.session.name;
    res.locals.authenticated = req.session.logined;
    if (!req.session.logined) {
        res.redirect('/');
        return;
    }
    res.render('./users/add_article', { title: 'Add Article' });
});

router.get('/modify/:id', function(req, res, next) {
    if (!req.session.logined) {
        res.redirect('/');
        return;
    }
    res.locals.username = req.session.name;
    res.locals.authenticated = req.session.logined;
    res.locals.messageID = req.params.id;
    Blog.find({ _id: req.params.id }, function(err, blogs, count) {
        res.render('users/modify', {
            title: 'Modify Article',
            blogs: blogs
        })
    })

});

router.get('/message/:id', function(req, res, next) {
    res.locals.username = req.session.name;
    res.locals.authenticated = req.session.logined;
    res.locals.messageID = req.params.id;
    Blog.find({ _id: req.params.id }, function(err, blogs, count) {
        Comment.find({ MessageID: req.params.id }, function(err, comments, count) {
            res.render('users/message', {
                title: 'Live a message',
                blogs: blogs,
                comments: comments
            })
        })
    })
});

module.exports = router;