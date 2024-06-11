import { Schema, model } from 'mongoose';
import validator from 'validator';

const ticketSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        maxlength: [30, 'Title cannot be more than 30 characters']
    },
    description: { 
        type: String, 
        required: true,
        maxlength: [150, 'Description cannot be more than 30 characters'] 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'low' 
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: { 
        type: String, 
        enum: ['open', 'in progress', 'closed'], 
        default: 'open' 
    },
    creatorEmail: { 
        type: String, 
        required: true, 
        validate: [validator.isEmail, 'Invalid email address']
    },
    messages: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Message' 
    }],
    image: { 
        type: String,
        required: true
    },
}, { timestamps: true });

const Ticket = model('Ticket', ticketSchema);

export default Ticket;