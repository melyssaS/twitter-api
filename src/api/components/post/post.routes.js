const Router = require("express") ;

const { timelinePost, 
    newPost, 
    getInfoPost, 
    likePost, 
    savePost,
    commentPost } = require("./post.controller");

const postRoutes = Router();

//Get timeline of an user
postRoutes.get('/timeline', timelinePost);

//Create a new posts
postRoutes.post('/', newPost);

//Get info of the post
postRoutes.get('/', getInfoPost);

//Post send a like
postRoutes.post('/like', likePost);

//Save post
postRoutes.post('/save', savePost);

//Comment on a post
postRoutes.post('/comment', commentPost);

module.exports = postRoutes;