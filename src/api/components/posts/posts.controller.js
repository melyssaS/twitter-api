
const { timelinePostService, 
    newPostService, 
    getInfoPostService, 
    likePostService,
    savePostService,
    commentPostService } = require('./posts.service');


const timelinePost = async (request, response) => {
    return timelinePostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const newPost = async (request, response) => {
    return newPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const getInfoPost = async (request, response) => {
    return getInfoPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const likePost = async (request, response) => {
    return likePostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const savePost = async (request, response) => {
    return savePostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const commentPost = async (request, response) => {
    return commentPostService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

module.exports = {timelinePost, newPost, getInfoPost, likePost, savePost, commentPost}