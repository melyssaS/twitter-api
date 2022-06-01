const Router = require("express") ;

const { timelinePosts, 
    newPosts, 
    getInfoPosts, 
    likePosts, 
    savePosts,
    commentPosts } = require("./posts.controller");

const postsRoutes = Router();

//Get timeline of an user
postsRoutes.get('/timeline', timelinePosts);

//Create a new posts
postsRoutes.post('/', newPosts);

//Get info of the post
postsRoutes.get('/', getInfoPosts);

//Post send a like
postsRoutes.post('/like', likePosts);

//Save post
postsRoutes.post('/save', savePosts);

//Comment on a post
postsRoutes.post('/comment', commentPosts);

module.exports = postsRoutes;