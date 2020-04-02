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
            required: true
        },

        password: {
            type: String, 
            required: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function(next) {
    const hashedPassword = await bcrypt.hash(this.password, 10); 
    this.password = hashedPassword; 
    next(); 
});

export default mongoose.model('User', UserSchema); 