const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOne, userOneId, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('User should sign up', async() => {
    const response = await request(app).post('/users').send({
        'name' : 'Prathesh',
        'email': 'bprathesh@gmail.com',
        'password': 'node123!'
    }).expect(201);



    const user = await User.findById(response.body.newUser._id);

    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        newUser: {
            'name' : 'Prathesh',
            'email': 'bprathesh@gmail.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBeNull();
});


test('Should allow user log in', async() => {
    const response = await request(app).post('/users/login').send({
        'email': userOne.email,
        'password': userOne.password
    }).expect(200);

    const user = await User.findById(response.body.user._id);

    expect(response.body.token).toBe(user.tokens[1].token);
});


test('Should not allow user to log in on Invalid Creds', async() => {
   await request(app).post('/users/login').send({
        'email': 'prathesh@gmail.com',
        'password': 'testingpass'
    }).expect(400);
});

test('Should allow user to get profile', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not allow user to get profile without auth', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should allow user to delete profile', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test('Should not allow user to delete profile without auth', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});


test('Should allow user to Upload image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar' , 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    
    const user = await User.findById(userOneId);

    expect(user.avatar).toEqual(expect.any(Buffer));
 });

 
test('Should allow user to Update info', async() => {
   const response = await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Test'
        })
        .expect(200);
    
    const user = await User.findById(userOneId);

    expect(user.createdAt).toEqual(new Date(response.body.createdAt));
 });


 test('Should not allow user to Update Invalid info', async() => {
    const response = await request(app)
         .patch('/users/me')
         .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
         .send({
             location: 'Test'
         })
         .expect(400);
  });