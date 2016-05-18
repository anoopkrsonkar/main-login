var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var mongoose = require('mongoose');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
		
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home1',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home1',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home1', isAuthenticated, function(req, res){
		res.render('home1', { user: req.user });
	});
	router.get('/helloworld',isAuthenticated, function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});
	router.get('/userlist',isAuthenticated, function(req, res) {

    var db = req.db;
    var collection = db.get('usercollection'); 

    
    collection.find({},{},function(e,docs)
    {
        res.render('userlist',
        {
            "userlist" : docs
        });
    });
});
	router.get('/businesslist',isAuthenticated, function(req, res) {
    var db = req.db;
    var collection = db.get('businesscollection');
    collection.find({},{},function(e,docs){
        res.render('businesslist', {
            "businesslist" : docs
        });
        //console.log(docs);
    });
});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/home',
			failureRedirect : '/'
		})
	);

	// route for twitter authentication and login
	// different scopes while logging in
	router.get('/login/twitter', 
		passport.authenticate('twitter'));

	// handle the callback after facebook has authenticated the user
	router.get('/login/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/twitter',
			failureRedirect : '/'
		})
	);

	/* GET Twitter View Page */
	router.get('/twitter', isAuthenticated, function(req, res){
		res.render('twitter', { user: req.user });
	});

	return router;
}





