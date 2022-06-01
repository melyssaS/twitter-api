const postModels = require('../models/user.models');
const reviewModels = require('../models/review.models');


function userPostService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await postModels.find({ owner_id: req.query.user_id });
            resolve(posts);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}


function lastPostService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await postModels.find({}, ' -updatedAt').sort({ updatedAt: -1 });
            resolve(posts);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
};


function getPostService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await postModels.findById(req.query.post_id);
            resolve(posts);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}

function createPostService(req) {
    return new Promise(async(resolve, reject) => {
        try {
            const newPost = await postModels.create(req.body);
            resolve(newPost);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}

function createReviewService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const newReview = await reviewModels.create(req.body);
            console.log(newReview);
            resolve(newReview);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error",status: 500 });
        }
    });
}

function getReviewService(req) {
    return new Promise(async(resolve, reject) => {
        try {
            const reviews = await reviewModels.find({  product_id: req.query.product_id })
                                             .sort({ rating: -1 });
            resolve(reviews);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error",status: 500 });
        }
    });
}

module.exports = { userPostService, lastPostService, getPostService, createReviewService, getReviewService }