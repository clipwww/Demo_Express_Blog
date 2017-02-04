require('../lib/db.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model("Blog");
var Comment = mongoose.model("Comment");

router.get('/delete/:id', function(req, res, next) {
    Blog.remove({ _id: req.params.id }, function(err, res, next) {
        if (err) {
            console.log("Error");
        } else {
            console.log("Done");
        }
    });
    res.redirect('/users/profile');
});

router.post('/login', function(req, res, next) {
    if ((!req.body.username) || (!req.body.password)) {
        res.redirect('/users/register');
        return;
    }
    req.session.name = req.body.username;
    req.session.password = req.body.password;
    req.session.logined = true;
    res.redirect('/');

    res.send('This is login function.');
});

router.post('/add', function(req, res, next) {
    if (!req.session.logined) {
        res.redirect('/');
        return;
    };

    new Blog({
        Username: req.body.username,
        Article: req.body.Content,
        CreateDate: Date.now()
    }).save(function(err) {
        if (err) {
            console.log("Error!");
            return;
        };
        console.log("Save to DB");
    });
    res.redirect('/');
});

router.post('/update/:id', function(req, res, next) {
    if (!req.params.id) {
        res.redirect('/');
        return;
    };
    Blog.update({ _id: req.params.id }, {
        Article: req.body.Content
    }, function(err) {
        if (err) {
            console.log("Error!");
            return;
        };
        console.log("Done");
    });
    res.redirect('/users/profile');
});

router.post('/comment/:id', function(req, res, next) {
    if (!req.params.id) {
        res.redirect('/');
        return;
    };
    new Comment({
        Visitor: req.body.Visitor,
        Comment: req.body.Comment,
        MessageID: req.params.id,
        CreateDate: Date.now()
    }).save(function(err) {
        if (err) {
            console.log("Error!");
            return;
        };
        console.log("Save to DB.");
    });
    res.redirect('/users/message/' + req.params.id);
});

module.exports = router;