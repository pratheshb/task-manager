const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancellationEmail } = require('../email/account')

const router = new express.Router();



router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const newUser = await user.save();

        sendWelcomeEmail(newUser.email, newUser.name)

        const token = await newUser.generateToken();

        res.status(201).send({ newUser, token });
    } catch (e) {
        res.status(400).send(e);
    }
});
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e.message || e);
    }

});
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e)
//     }
// });

// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdateKeys = ['name', 'age', 'password', 'email'];

//     const isValidUpdate = updates.every(update => allowedUpdateKeys.includes(update));

//     if (!isValidUpdate) {
//         return res.status(400).send('invalid param');
//     }

//     try {

//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).send();
//         }

//         updates.forEach(update => user[update] = req.body[update]);

//         const modifiedUser = await user.save();

//         res.send(user);

//     } catch (e) {
//         res.status(400).send(e);
//     }
// });

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdateKeys = ['name', 'age', 'password', 'email'];

    const isValidUpdate = updates.every(update => allowedUpdateKeys.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send('invalid param');
    }

    try {

        const user = req.user;

        updates.forEach(update => user[update] = req.body[update]);

        await user.save();

        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }
});

// router.delete('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findByIdAndDelete(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e)
//     }
// });

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('Please Upload Images only'));
        }

        cb(undefined, true);
    }
});

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;

    await req.user.save();

    res.send();
}, (err, req, res, next) => {
    res.status(400).send({Error: err.message});
});

router.delete('/users/me/avatar',auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();

    }
});

module.exports = router;