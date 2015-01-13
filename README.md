# gyft

## Client for accessing the Gyft API

## Install

```bash
$ npm install --save gyft
```

## Test

```bash
$ npm test
```

## Example

```js
var Gyft = require('gyft')
var gyft = Gyft({
  apiKey: 'blah'
, secret: 'blah'
})

gyft.listCards(function(err, cards) {
  if (err) throw err // error should be handled, not thrown
  console.log(cards)
  // => [ { id: <card id>
  // =>   , merchant_id: <merchant id>
  // =>   , merchant_name: <merchant name>
  // =>   , card_currency_code: 'USD'
  // =>   , opening_balance: 100
  // =>   , merchant_icon_image_url_hd: 'http://...'
  // =>   , cover_image_url_hd: 'http://...'
  // =>   } ]
})
```

## Usage

### Gyft(opts)

`opts` must contain both an `apiKey` and `secret` property. It may also
contain a `url` property. The url will be the API url to use to access
the Gyft API.  It currently defaults to the sandbox (this will change once the
package hits 1.x)


#### Gyft.prototype.listCards(Object:opts, cb)

`opts` can contain a `format` property that will format the results into an object.

`cb` will be called with `function(err, results)`


#### Gyft.prototype.account(cb)

Returns the account info

#### Gyft.prototype.purchaseCard(Object:card, cb)

Acceptable Parameters:

- `shop_card_id` The unique id of the shop card (required)
- `to_email` The user email address (required)
- `reseller_reference` Reseller reference code
- `return_direct_link` Return a direct link to the gift card
- `first_name` The user first name (recommended)
- `last_name` The user last name
- `birthday` The user's birthday

#### Gyft.prototype.allTransactions(cb)

Returns all transactions

#### Gyft.prototype.lastTransactions(count, cb)

Returns the last _count_ transactions

#### Gyft.prototype.firstTransactions(count, cb)

Returns the first _count_ transactions


## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
