process.env.NODE_ENV = 'test'

var request = require('supertest')
var chai = require('chai')
var expect = chai.expect

var app = require('../app')

describe('api endpoint test', function() {
  describe('GET /api', function() {
    it('should respond "Hello World"', function(done) {
      request(app)
      .get('/api/todo')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err

        expect(res.text).to.equal('Hello World')
        done()
      })
    })
  })

  describe('GET /api/todo/items', function() {
    it('should respond JSON Array', function(done) {
      this.timeout(5000)
      // this.timeout(30e3)
      request(app)
      .get('/api/todo/items')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err

        expect(res.body).to.be.an('array')
        done()
      })
    })
  })

  describe('POST /api/todo/item', function() {
    it('should respond {_id, title, content, ...}', function(done) {
      this.timeout(5000)

      var item = {
        title: 'TEST TITLE',
        content: 'TEST CONTENT',
        status: 0
      }

      request(app)
      .post('/api/todo/item')
      .send(item)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err

        expect(res.body).to.be.a('object')
        // expect(res.body).to.have.property('success').to.be.true
        // expect(res.body).to.have.property('item')
        expect(res.body).to.have.property('title').to.equal(item.title)
        expect(res.body).to.have.property('content').to.equal(item.content)
        expect(res.body).to.not.have.property('deadline')
        expect(res.body).to.have.property('priority').to.equal(2)
        expect(res.body).to.have.property('status').to.equal(item.status)

        done()
      })
    })

    it('should respond {..., deadline, priority, status}', function(done) {
      this.timeout(5000)

      var deadline = new Date()
      deadline.setDate(deadline.getDate() + 7)
      var item = {
        title: 'TEST TITLE',
        content: 'TEST CONTENT',
        deadline: deadline,
        priority: 4,
        status: 2
      }

      request(app)
      .post('/api/todo/item')
      .send(item)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err

        expect(res.body).to.be.a('object')
        // expect(res.body).to.have.property('success').to.equal(true)
        // expect(res.body).to.have.property('item')
        expect(res.body).to.have.property('title').to.equal(item.title)
        expect(res.body).to.have.property('content').to.equal(item.content)
        expect(res.body).to.have.property('deadline').to.exist
        expect(res.body).to.have.property('priority').to.equal(item.priority)
        expect(res.body).to.have.property('status').to.equal(item.status)

        done()
      })
    })
  })

})
