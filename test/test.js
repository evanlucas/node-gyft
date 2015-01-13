var should = require('should')
  , mock = require('./mock')
  , Gyft = require('../')

describe('gyft', function() {
  var port, gyft
  before(function(done) {
    var self = this
    mock.listen(function(err) {
      if (err) return done(err)
      port = mock.address().port
      var url = 'http://localhost:' + port
      gyft = Gyft({
        apiKey: 'fdsafasd'
      , secret: 'fdasfdadf'
      , url: url
      })
      done()
    })
  })

  it('should throw if missing constructor opts', function() {
    ;(function() {
      new Gyft()
    }).should.throw(/opts is required/)

    ;(function() {
      new Gyft({})
    }).should.throw(/opts.apiKey is required/)

    ;(function() {
      new Gyft({ apiKey: 'fdsadf' })
    }).should.throw(/opts.secret is required/)
  })

  it('should allow fetching account', function(done) {
    gyft.account(function(err, out) {
      if (err) return done(err)
      should.exist(out)
      done()
    })
  })

  it('should allow listing cards', function(done) {
    gyft.listCards(function(err, out) {
      if (err) return done(err)
      should.exist(out)
      out.should.be.instanceOf(Array)
      out.should.have.length(3)
      done()
    })
  })

  it('should allow listing cards and returning formatted res', function(done) {
    gyft.listCards({ format: true }, function(err, out) {
      if (err) return done(err)
      should.exist(out)
      out.should.be.type('object')
      out.should.have.property('T.G.I. Friday\'s')
      done()
    })
  })

  it('should allow purchasing cards', function(done) {
    gyft.purchaseCard({
      shop_card_id: 3316
    , to_email: 'test@gawminers.com'
    , reseller_reference: 'blah'
    }, function(err, res) {
      if (err) return done(err)
      should.exist(res)
      res.should.be.type('object')
      res.should.have.property('url')
      done()
    })
  })

  it('should allow getting all transactions', function(done) {
    gyft.allTransactions(function(err, res) {
      if (err) return done(err)
      should.exist(res)
      res.should.have.length(2)
      done()
    })
  })

  it('should allow getting :count last transactions', function(done) {
    gyft.lastTransactions(1, function(err, res) {
      if (err) return done(err)
      should.exist(res)
      res.should.have.length(1)
      res[0].should.have.property('id', 1235)
      done()
    })
  })

  it('should allow getting all transactions', function(done) {
    gyft.firstTransactions(1, function(err, res) {
      if (err) return done(err)
      should.exist(res)
      res.should.have.length(1)
      res[0].should.have.property('id', 1234)
      done()
    })
  })
})
