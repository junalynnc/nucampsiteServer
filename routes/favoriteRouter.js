const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    req.body.forEach(item => {
                        if (!favorite.campsites.includes(item._id)) {
                            favorite.campsites.push(item);
                        }
                    });
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    Favorite.create({ user: req.user._id })
                        .then((favorite) => {
                            req.body.forEach(item => {
                                favorite.campsites.push(item);
                            })
                            favorite.save().then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favorite);
                            })
                                .catch((err) => next(err));
                        });
                }
            });
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end('No favorite to delete!');
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }).then((favorite) => {
            if (favorite) {
                if (!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId);
                }
                favorite.save().then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                    .catch((err) => next(err));
            } else {
                Favorite.create({
                    user: req.user._id,
                    campsites: [req.params.campsiteId]
                })
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            }
        })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    const favoriteIndex = favorite.campsites.indexOf(req.params.campsiteId);
                    if (favoriteIndex !== -1) {
                        favorite.campsites.splice(favoriteIndex, 1);
                        favorite.save().then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        });
                    } else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end("No favorite campsite to delete!");
                    }
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("No favorite to delete!");
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;


