/**
 * @jest-environment node
 */

require('dotenv').config({ path: `${__dirname}/../config.env` });

process.env.JWT_SECRET = 'GzVf5TUwhayXLdtAQSRFvQ==';
process.env.JWT_EXPIRES_IN = '10d';
process.env.JWT_COOKIE_EXPIRES_IN = 1;
process.env.DATABASE = 'mongodb+srv://johnvict:WUMglwNBaydH8Yvu@homelike.i9lrm.mongodb.net/homelike_test?retryWrites=true&w=majority';

const config = require('../../src/App/config');
const supertest = require('supertest');
const mongoose = require('mongoose');

const UserModel = require('../../src/models/UserModel');

const testApp = () => supertest(config.app);

let response;

afterEach(async () => {
  // await UserModel.deleteMany();
});


describe('Creating a new user', () => {
  const payload = {
    name: 'sample user',
    email: 'sample@user.com',
    password: 'secret_password',
  };


  jest.setTimeout(15000);
  beforeAll(async () => {
    const newUser = async () => {
      response = await testApp().post('/api/v1/user/signup').send(payload);
    };
    await newUser();
  });

  it('Should return status code 201, ', async () => {
    expect(response.statusCode).toBe(201);
  });

  it('Should return response as object, ', async () => {
    expect(typeof response.body).toBe('object');
  });

  it("Response Body Should have a field status which is 'success'", async () => {
    expect(response.body.status).toBe('success');
  });

  it('Response Body Should have a field data that has same email as we sent', async () => {
    expect(response.body.data.email).toBe(payload.email);
  });

  it('Should return status code 404', async () => {
    const response = await testApp().get('/not-found');
    expect(response.statusCode).toBe(404);
  });
});

describe('Creating a new user with invalid data', () => {
  const payload = {
    name: 'sample user',
    email: 'sample@user.com',
    password: 'low_len',
  };


  jest.setTimeout(15000);
  beforeAll(async () => {
    const newUser = async () => {
      response = await testApp().post('/api/v1/user/signup').send(payload);
    };
    await newUser();
  });

  it('Should return status code 400, ', async () => {
    expect(response.statusCode).toBe(400);
  });

  it("Response Body Should have a field status which is 'failed'", async () => {
    expect(response.body.status).toBe('failed');
  });
});

describe('Login with valid password', () => {
  const payload = {
    email: 'sample@user.com',
    password: 'secret_password',
  };


  jest.setTimeout(15000);
  beforeAll(async () => {
    const loginUser = async () => {
      response = await testApp().post('/api/v1/user/login').send(payload);
    };
    await loginUser();
  });

  it('Should return status code 200, ', async () => {
    expect(response.statusCode).toBe(200);
  });

  it("Response Body Should have a field status which is 'success'", async () => {
    expect(response.body.status).toBe('success');
  });

  it("Response Body Should have have a an auth token field", async () => {
    expect(response.body.token).toBeDefined();
  });
});

describe('Login with invalid password', () => {
  const payload = {
    email: 'sample@user.com',
    password: 'wrong_password',
  };


  jest.setTimeout(15000);
  beforeAll(async () => {
    const loginUser = async () => {
      response = await testApp().post('/api/v1/user/login').send(payload);
    };
    await loginUser();
  });

  it('Should return status code 401, ', async () => {
    expect(response.statusCode).toBe(401);
  });

});


afterAll(async () => {
  await UserModel.deleteMany();
  await mongoose.connection.close();
});
