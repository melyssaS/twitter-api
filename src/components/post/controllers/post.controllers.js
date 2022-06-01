import { Request, Response } from "express";

const { userPostService, 
    lastPostService, 
    getPostService, 
    createPostService,
    createReviewService,
    getReviewService } = require('../services/post.services');


const userPost = async (request, response) => {
    return userPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const lastPost = async (request, response) => {
    return lastPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const getPost = async (request, response) => {
    return getPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const createPost = async (request, response) => {
    return createPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const createReview = async (request, response) => {
    return createReviewService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const getReview = async (request, response) => {
    return getReviewService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

module.exports = {userPost, lastPost, getPost, createPost, createReview, getReview}