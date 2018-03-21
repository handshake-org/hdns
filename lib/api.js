'use strict';

const bns = require('bns');
const ResolvConf = require('./resolvconf');
const {StubResolver} = require('./resolver');

/*
 * Constants
 */

const conf = ResolvConf.fromSystem();

/**
 * API
 * @extends bns.API
 */

class API extends bns.API {
  constructor(createResolver = defaultResolver) {
    super(createResolver);
    this._conf = conf.clone();
  }
}

/*
 * Helpers
 */

function defaultResolver(conf, hosts) {
  const resolver = new StubResolver();
  resolver.conf = conf;
  resolver.hosts = hosts;
  return resolver;
}

/*
 * Expose
 */

module.exports = API;
