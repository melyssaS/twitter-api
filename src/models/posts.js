const mongoose = require( 'mongoose');

const postsSchema = new mongoose.Schema({

    owner_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },

    img_url: { 
        type: String, 
        required: true  
    },

    bio: { 
        type: String, 
        required: true 
    },

    author: { 
        type: String, 
        required: true 
    },

    likes: { 
        type: String, 
        required: false 
    },

    comments: { 
        type: JSON, 
        required: false 
    },
    
}, { timestamps: { createdAt: 'created_date' } })

module.exports = mongoose.model('posts', postsSchema);