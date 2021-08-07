const express = require("express");
const Promotion = require("../models/promotion");
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

promotionRouter
    .route("/")
    .all((req, res, next) => {
        res.setHeader("Content-Type", "application/json");
        return next();
    })
    .get((req, res, next) => {
        Promotion.find()
            .then((promotions) => {
                res.statusCode = 200;
                res.json(promotions);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log("Promotion Created ", promotion);
                res.statusCode = 200;
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /promotions");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotion.deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.json(response);
            })
            .catch((err) => next(err));
    });

promotionRouter
    .route("/:promotionId")
    .all((req, res, next) => {
        res.setHeader("Content-Type", "application/json");
        return next();
    })
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then((promotion) => {
                res.statusCode = 200;
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(
            `POST operation not supported on /promotions/${req.params.promotionId}`
        );
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Promotion.findByIdAndUpdate(
            req.params.promotionId,
            {
                $set: req.body,
            },
            { new: true }
        )
            .then((promotion) => {
                res.statusCode = 200;
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
            .then((response) => {
                res.statusCode = 200;
                res.json(response);
            })
            .catch((err) => next(err));
    });

module.exports = promotionRouter;