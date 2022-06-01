
const { timelinePostsService, 
    newPostsService, 
    getInfoPostsService, 
    likePostsService,
    savePostsService,
    commentPostsService } = require('./posts.service');


const timelinePosts = async (request, response) => {
    return timelinePostsService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const newPosts = async (request, response) => {
    return newPostsService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const getInfoPosts = async (request, response) => {
    return getInfoPostsService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const likePosts = async (request, response) => {
    return likePostsService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const savePosts = async (request, response) => {
    return savePostsService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

const commentPosts = async (request, response) => {
    return commentPostsService(request)
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            response.status(err.status).send(err.data);
        });
}

module.exports = {timelinePosts, newPosts, getInfoPosts, likePosts, savePosts, commentPosts}