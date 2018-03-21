'use strict';

const bns = require('bns');
const IP = require('binet');
const blake2b = require('bcrypto/lib/blake2b');
const secp256k1 = require('bcrypto/lib/secp256k1');
const ResolvConf = require('./resolvconf');
const {hsig} = bns;

/**
 * StubResolver
 * @extends bns.StubResolver
 */

class StubResolver extends bns.StubResolver {
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

exports.StubResolver = StubResolver;
