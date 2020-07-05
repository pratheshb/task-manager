const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const newTask = await task.save();
        res.status(201).send(newTask);
    } catch (e) {
        res.status(400).send(e);
    }
});

// use query string to filter based on completed status
// tasks?limit=10&skip=10 return 11 - 20 records used in pagination
// tasks?sortBy=createdAt_asc sort by createdAt field in asc order
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({owner: req.user._id});
        const match = {};
        if(req.query.completed){
            match.completed = req.query.completed === 'true';
        }
        const sort = {};
        if(req.query.sortBy){
            const sortByArr = req.query.sortBy.split('_');
            sort[sortByArr[0]] = sortByArr[1] === 'dsc' ? -1 : 1
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     createdAt : -1
                // }
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id , owner: req.user._id})

        if (!task) {
           return res.status(404).send();
        }
        return res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdateKeys = ['desc', 'completed'];

    const isValidUpdate = updates.every( update => allowedUpdateKeys.includes(update));

    if(!isValidUpdate){
        return res.status(400).send('Invalid Params')
    }

    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }

        updates.forEach(update => task[update] = req.body[update]);
        const modifiedTask = await task.save();      
        return res.send(modifiedTask)
        
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if (!task) {
          return res.status(404).send();
        }
       return res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});


module.exports = router;