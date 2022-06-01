const postsModels = require('./posts.models');


function timelinePostsService(req) {
    return new Promise(async (resolve, reject) => {
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

            resolve(posts);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}


function newPostsService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const newPost = await postsModels.create(req.body);
            resolve({ data: "OK", status: 401 });
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
};


function getInfoPostsService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await postsModels.findById(req.query.post_id);
            resolve(posts);
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}

function likePostsService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await postsModels.findById(req.body.post_id);
            postsModels.findOneAndUpdate({ _id: req.body.post_id }, {
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
            resolve({ data: "Updated", status: 400 });
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}

function savePostsService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve({ data: "Ok", status: 401 });
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}

function commentPostsService(req) {
    return new Promise(async (resolve, reject) => {
        try {
            postsModels.findOneAndUpdate({ _id: req.body.post_id }, {
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
            resolve({ data: "Updated", status: 400 });
        } catch (error) {
            console.log(error);
            reject({ data: "Server internal error", status: 500 });
        }
    });
}

module.exports = { timelinePostsService, newPostsService, getInfoPostsService, likePostsService, savePostsService, commentPostsService }