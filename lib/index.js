var request = require('request')
  , crypto = require('crypto')
  , assert = require('assert')
  , format = require('util').format

module.exports = Gyft

function Gyft(opts) {
  if (!(this instanceof Gyft))
    return new Gyft(opts)

  this.opts = opts

  assert(this.opts, 'opts is required')
  assert(this.opts.apiKey, 'opts.apiKey is required')
  assert(this.opts.secret, 'opts.secret is required')
  this.opts.url = this.opts.url || 'https://apitest.gyft.com/mashery/v1'
}

Gyft.prototype._req = function(input, cb) {
  var url = input.url
    , method = input.method || 'GET'
  var ts = getTime()
  var sig = this.opts.apiKey + this.opts.secret + ts
  var signedSig = sign(sig)
  var opts = {
    url: format('%s/%s', this.opts.url, url)
  , qs: {
      api_key: this.opts.apiKey
    , sig: signedSig
    }
  , json: true
  , headers: {
      'x-sig-timestamp': ts
    }
  , method: method
  }

  if (input.body) opts.body = input.body

  request(opts, function(err, res, body) {
    if (err) return cb(err)
    var code = res.statusCode
    if (code >= 400) {
      var err = new Error('Received ' + code + ' status code')
      err.code = code
      err.body = body
      return cb(err)
    }
    cb(null, body)
  })
}

Gyft.prototype.listCards = function(opts, cb) {
  if ('function' === typeof opts) cb = opts, opts = {}
  this._req({
    url: 'reseller/shop_cards'
  , method: 'GET'
  }, function(err, data) {
    if (err) return cb(err)
    if (!data.length || !opts.format) return cb(null, data)
    data = data.reduce(function(set, item) {
      if (!set.hasOwnProperty(item.merchant_name)) {
        set[item.merchant_name] = {
          merchant_id: item.merchant_id
        , merchant_name: item.merchant_name
        , terms: item.terms_and_conditions
        , merchant_icon_image_url_hd: item.merchant_icon_image_url_hd
        , cover_image_url_hd: item.cover_image_url_hd
        , cards: []
        }
      }
      set[item.merchant_name].cards.push({
        id: item.id
      , currency: item.card_currency_code
      , amount: +item.opening_balance
      })
      return set
    }, {})

    var keys = Object.keys(data)
      , len = keys.length

    for (var i=0; i<len; i++) {
      var key = keys[i]
      data[key].cards.sort(function(a, b) {
        return a.amount < b.amount
          ? -1
          : a.amount > b.amount
          ? 1
          : 0
      })
    }

    cb(null, data)
  })
}

Gyft.prototype.account = function(cb) {
  this._req({
    url: 'reseller/account'
  , method: 'GET'
  }, cb)
}

Gyft.prototype.purchaseCard = function(card, cb) {
  this._req({
    url: 'reseller/purchase/card'
  , method: 'POST'
  , body: card
  }, cb)
}

Gyft.prototype.allTransactions = function(cb) {
  this._req({
    url: 'reseller/transactions'
  , method: 'GET'
  }, cb)
}

Gyft.prototype.lastTransactions = function(count, cb) {
  count = count || 100
  this._req({
    url: 'reseller/transactions/last/' + count
  , method: 'GET'
  }, cb)
}

Gyft.prototype.firstTransactions = function(count, cb) {
  count = count || 100
  this._req({
    url: 'reseller/transactions/first/' + count
  , method: 'GET'
  }, cb)
}

function sign(str) {
  return crypto.createHash('sha256')
    .update(str)
    .digest('hex')
}

function getTime() {
  return Math.round(new Date().getTime() / 1000).toString()
}
