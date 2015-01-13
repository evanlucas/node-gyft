var http = require('http')
  , fixtures = require('./fixtures')

function handle(req, res) {
  var idx = req.url.indexOf('?')
  var url = req.url.slice(0, idx)
  switch (url) {
    case '/reseller/account':
      return response(200, res, fixtures.account)
    case '/reseller/shop_cards':
      return response(200, res, fixtures.cards)
    case '/reseller/purchase/card':
      return response(201, res, fixtures.purchase)
    case '/reseller/transactions':
      return response(200, res, fixtures.transactions)
    case '/reseller/transactions/last/1':
      var d = fixtures.transactions[1]
      return response(200, res, [d])
    case '/reseller/transactions/first/1':
      var d = fixtures.transactions[0]
      return response(200, res, [d])
  }

  res.end()
}

module.exports = http.createServer(handle)

function response(code, res, data) {
  var o = new Buffer(JSON.stringify(data))
  res.writeHead(code, {
    'Content-Type': 'application/json'
  , 'Content-Length': o.length
  })
  return res.end(o)
}
