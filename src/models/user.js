const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        min: [0, 'Age should not be negative.']
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value === 'password'){
                throw new Error('Invalid Password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET ,{expiresIn : '30 minutes'});

    user.tokens = user.tokens.concat({token});

    await user.save();
    
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;

    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Invalid Credentilas');
    }

    return user;
}


userSchema.pre('save' , async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({owner: user._id})

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;