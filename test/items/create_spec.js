/* global describe, it, expect, api, beforeEach */

const User = require('../../models/user');
const jwt = require('jsonwebtoken');

// TODO: add secret to environment file
const { secret } = require('../../config/environment');

const Item = require('../../models/item');

const userIds = [
  '5be9860fcb16d525543ceda1'
];

const itemData =
  {
    // Created by Joe
    createdBy: userIds[1],
    itemName: 'Nike Air Force 1',
    imageUrl: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/bzzopsvmjq8cmrc2z4rr/air-force-1-big-kids-shoe-Pw8c4R.jpg',
    seller: 'Joe',
    catgories: ['shoes, nike, man, woman, white'],
    price: 80,
    uploadDate: 16/11/18,
    location: 'Aldgate East',
    size: '6',
    colour: 'white',
    //Users can comment on items
    comments: [
      {
        text: 'Nice Joe! I love these shoes!!',
        user: userIds[0]
      }
    ]
  };

let token;

describe('Items CREATE', () => {

  beforeEach(done => {
    Item.remove({})
      .then(() => User.remove({}))
      .then(() => User.create({
        email: 'test',
        username: 'test',
        password: 'test'
      }))
      .then(user => {
        token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
        done();
      });
  });

  it('should return a 401 response without a token', done => {
    api.post('/api/items')
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 401 without a body', done => {
    api.post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return the correct message when no body is sent', done => {
    api.post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).to.eq('no data given');
        done();
      });
  });

  it('should return an 200, with a valid body', done => {
    api.post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(itemData)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an object if the body contains an object', done => {
    api.post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(itemData)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return an object with the correct name', done => {
    api.post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(itemData)
      .end((err, res) => {
        // test the type of res.body
        expect(res.body.itemName).to.eq(itemData.itemName);
        done();
      });
  });
});
