'use strict';

const IP = require('binet');
const hsig = require('bns/lib/hsig');
const BNSStubResolver = require('bns/lib/resolver/stub');
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

    if (!key) {
      this.log(`Skipped SIG0 validation for ${address}.`);
      return true;
    }

    const result = hsig.verify(msg, key);

    if (result)
      this.log(`Validated SIG0 for ${address}.`);
    else
      this.log(`Invalid SIG0 for ${address}!`);

    return result;
  }
}

/*
 * Expose
 */

module.exports = StubResolver;
