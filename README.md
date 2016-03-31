# passport-keyverify

[Passport](http://passportjs.org/) strategy for authenticating using a public/private key pair to sign a nonce challenge.

This module allows you to verify a request or session using public and private key
pairs.
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-keyverify

## Usage

#### Configure Strategy
```
passport.use(new KeyVerifyStrategy( this.verify ));
```

#### Authenticate Requests

```
  this.verify = function(username, nonce, signature, callback) {
    console.log("[server.passport.keyVerify] nonce: " + nonce + " signature: " + signature);
    User.findByUsername(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      var sigBuffer = new Buffer(signature, 'base64');
      var sigString = sigBuffer.toString();

      console.log("[server.passport.keyVerify] sigString: " + sigString);

      var publicKey = user.publicKey;
      EncryptionManager.verifyMessageSignature(sigString, publicKey, nonce, function(err, signatureFingerprint) {
        if (err) { return callback("[AuthenticationManager.verifySignature] ERROR: " + err, false); };
        var sessionUser = user.id;

        if (signatureFingerprint) {
          logger.debug("[authentication.verify] User '" + user.username + "' verification SUCCESS with signature fingerprint '" + signatureFingerprint + "'");
          return callback(null, true);
          logger.debug("[authentication.verify] User '" + user.username + "' verification FAILED!");
        } else {
          return callback(null, false);
        }
      });
    });
  };
```

## Examples

For examples of workign code please see the following [examples](https://github.com/phutchins/passport-keyverify) included.

## Tests

    $ npm install
    $ npm test
