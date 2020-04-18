const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); 

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        
        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String, 
            required: true
        },

        admin: {
            type: Boolean, 
            default: false
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(this.password, 10); 
    this.password = hashedPassword; 
    next(); 
});

module.exports = mongoose.model('User', UserSchema);