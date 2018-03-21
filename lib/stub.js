'use strict';

const IP = require('binet');
const hsig = require('bns/lib/hsig');
const BNSStubResolver = require('bns/lib/resolver/stub');
const blake2b = require('bcrypto/lib/blake2b');
const secp256k1 = require('bcrypto/lib/secp256k1');
const ResolvConf = require('./resolvconf');

/**
 * StubResolver
 * @extends bns.StubResolver
 */

class StubResolver extends BNSStubResolver {
  constructor(options) {
    super(options);
    this.conf = new ResolvConf();
  }

  verify(msg, address, port) {
    const hostname = IP.toHost(address, port);
    const key = this.conf.keys.get(hostname);

    if (!key)
      return true;

    return hsig.verify(msg, key, blake2b, secp256k1);
  }
}

/*
 * Expose
 */

module.exports = StubResolver;
