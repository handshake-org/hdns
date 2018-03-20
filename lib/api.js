'use strict';

const bns = require('bns');
const ResolvConf = require('./resolvconf');
const {StubResolver, OSResolver} = require('./resolver');

/*
 * Constants
 */

const conf = ResolvConf.fromSystem();

/**
 * API
 * @extends bns.API
 */

class API extends bns.API {
  constructor() {
    super();
    this._servers = conf.getServers();
  }

  async _stub() {
    const resolver = new StubResolver();
    resolver.setServers(this._servers);
    return resolver.open();
  }

  async _os() {
    const resolver = new OSResolver();
    return resolver.open();
  }
}

/*
 * Expose
 */

module.exports = API;
