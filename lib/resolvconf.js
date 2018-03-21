'use strict';

const Path = require('path');
const bns = require('bns');

/*
 * Constants
 */

const HANDSHAKE_NS = [
  '127.0.0.1'
];

/**
 * ResolvConf
 * @extends bns.ResolvConf
 */

class ResolvConf extends bns.ResolvConf {
  constructor() {
    super();
  }

  getSystem() {
    if (process.platform === 'win32') {
      const root = process.env.SystemRoot || 'C:\\Windows';
      return Path.join(root, '\\System32\\Drivers\\etc\\hresolv.conf');
    }

    return '/etc/hresolv.conf';
  }

  setDefault() {
    return this.setServers(HANDSHAKE_NS);
  }

  readEnv() {
    if (process.env.HSK_LOCALDOMAIN)
      this.parseDomain(process.env.HSK_LOCALDOMAIN);

    if (process.env.HSK_RES_OPTIONS)
      this.parseOptions(process.env.HSK_RES_OPTIONS);

    return this;
  }
}

/*
 * Expose
 */

module.exports = ResolvConf;
