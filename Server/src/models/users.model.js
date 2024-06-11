import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: [30, 'Firstname cannot be more than 30 characters']
    },
    lastname: {
        type: String,
        required: true,
        maxlength: [30, 'Lastname cannot be more than 30 characters']
    },
    email: { 
        type: String, 
        required: true, 
        unique: true ,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [20, 'Password cannot be more than 20 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'support'],
        default: 'user'
    }
}, { timestamps: true });

// Hash the user's password before saving it to the database
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = model('User', userSchema);

export default User;