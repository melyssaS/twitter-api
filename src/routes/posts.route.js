const Router = require("express") ;

const postsRoutes = Router();
const postsModels = require('../models/posts');

//Get timeline of an user
postsRoutes.get('/timeline', async() => {
    try {
        let recordPerPage = 5;
        let totalPages = await postsModels.count();
        let pages = Math.ceil(totalPages / recordPerPage);

        let pageNumber = (req.body.page == null || req.body.page > pages) ? 1 : req.body.page;
        let startFrom = (pageNumber - 1) * recordPerPage;

        const posts = await postsModels.find({})
            .sort({ "id": -1 })
            .skip(startFrom)
            .limit(recordPerPage)
            .toArray();

            response.json(posts);
    } catch (error) {
        console.log(error);
        response.status(500).send("Server internal error");
    }
});

//Create a new posts
postsRoutes.post('/', async() => {
    try {
        const newPost = await postsModels.create(req.body);
        response.json({
            data: 'ok',
            status: 200
        });
    } catch (error) {
        console.log(error);
        response.status(500).send("Server internal error");
    }
});

//Get info of the post
postsRoutes.get('/', async() => {
    try {
        const posts = await postsModels.findById(req.query.post_id);
        response.json(posts);
    } catch (error) {
        console.log(error);
        response.status(500).send("Server internal error");
    }
});

//Post send a like
postsRoutes.post('/like', async() => {
    try {
        const posts = await postsModels.findById(req.body.post_id);
        await postsModels.findOneAndUpdate({ _id: req.body.post_id }, {
            $set: {
                like: posts.like,
            }
        }, function (error, info) {
            if (error) {
                res.json({
                    result: false,
                    msg: 'No se pudo modificar el post',
                    err
                });
            } else {
                res.json({
                    result: true,
                    info: info
                })
            }
        });
        response.json({ data: "Updated", status: 200 });
    } catch (error) {
        console.log(error);
        response.status(500).send("Server internal error");
    }
});

//Save post
postsRoutes.post('/save', async() => {
    try {
        response.json({ data: "Ok", status: 200 });
    } catch (error) {
        console.log(error);
        response.status(500).send("Server internal error");
    }
});

//Comment on a post
postsRoutes.post('/comment', async() => {
    try {
        await postsModels.findOneAndUpdate({ _id: req.body.post_id }, {
            $set: {
                comments: req.body.comments,
            }
        }, function (error, info) {
            if (error) {
                res.json({
                    result: false,
                    msg: 'No se pudo modificar el post',
                    err
                });
            } else {
                res.json({
                    result: true,
                    info: info
                })
            }
        });
        response.json({ data: "Update", status: 200 });
    } catch (error) {
        console.log(error);
        response.status(500).send("Server internal error");
    }
});

module.exports = postsRoutes;