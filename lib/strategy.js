/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');

/**
 * `Strategy` constructor.
 *
 * This strategy verifies that a user holds the private key that belongs to a certain
 * public key by confirming a signature passed into this module.
 *
 * This strategy must be provided a callback which takes a username (or id), nonce (which
 * should be a unique never repeating string like a timestamp), and a signed version of
 * the nonce.
 *
 * Most of the verification bits need to be moved into these methods
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */

function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('KeyVerifyStrategy requires a verify callback'); }

  passport.Strategy.call(this);
  this.name = 'keyverify';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};

  var username = req.headers.username;
  var nonce = req.headers.nonce;
  var signature = req.headers.signature;

  if (!username || !nonce || !signature) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }

  var self = this;

  function verified(err, userId, info) {
    if (err) { return self.error(err); }
    if (!userId) { return self.fail(info); }
    self.success(userId, info);
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, username, nonce, signature, verified);
    } else {
      this._verify(username, nonce, signature, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
