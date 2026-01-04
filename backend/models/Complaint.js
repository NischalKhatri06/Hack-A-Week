import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    department: { type: String, required: true },
    priority: { type: String, required: true, enum: ['emergency', 'high', 'medium', 'low'] },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'in-progress', 'resolved'] },
    userId: { type: String, required: true },  // stored as string (ObjectId as string)
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);