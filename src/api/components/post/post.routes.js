import { Router } from "express";

const { userPost, 
    lastPost, 
    getPost, 
    createPost, 
    createReview,
    getReview } = require('../post.controllers');

const postRoutes = Router();


//Get post of a User
postRoutes.get('/user', userPost);

//Get most recent post
postRoutes.get('/last', lastPost);

//Get individual post
postRoutes.get('/', getPost);

//Create a new post
postRoutes.post('/', createPost);

//Create a new review for a post
postRoutes.post('/review', createReview);

//Get reviews of a post
postRoutes.get('/review', getReview);

export default postRoutes;