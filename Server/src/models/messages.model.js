import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    ticket: { 
        type: Schema.Types.ObjectId, 
        ref: 'Ticket', 
        required: true 
    },
    sender: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

const Message = model('Message', messageSchema);

export default Message;
