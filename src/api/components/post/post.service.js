const postModels = require('./post.models');


function timelinePostService(req) {
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


function newPostService(req) {
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


function getInfoPostService(req) {
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

function likePostService(req) {
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

function savePostService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const newReview = await postModels.create(req.body);
            console.log(newReview);
            resolve(newReview);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error",status: 500 });
        }
    });
}

function commentPostService(req) {
    return new Promise(async(resolve, reject) => {
        try {
            const reviews = await postModels.find({  product_id: req.query.product_id })
                                             .sort({ rating: -1 });
            resolve(reviews);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error",status: 500 });
        }
    });
}

module.exports = { timelinePostService, newPostService, getInfoPostService, likePostService, savePostService, commentPostService }