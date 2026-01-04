import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    searchTerm: { 
        type: String, 
        required: true,
        trim: true
    },
    searchType: { 
        type: String, 
        enum: ['jobs', 'careers', 'documents'], 
        default: 'jobs'
    },
    searchDate: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Index for faster queries
searchHistorySchema.index({ userId: 1, searchDate: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);