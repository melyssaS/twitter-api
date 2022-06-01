import mongoose from 'mongoose';

const postsSchema = new mongoose.Schema({

    owner_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },

    img_url: { 
        type: String, 
        required: true 
    },

    display_name: { 
        type: String, 
        required: true 
    },

    description: { 
        type: String, 
        required: true 
    },

    price: { 
        type: String, 
        required: true 
    },
    
}, { timestamps: { createdAt: 'created_date' } })

module.exports = mongoose.model('posts', postsSchema);