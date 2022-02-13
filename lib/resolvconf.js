'use strict';

const Path = require('path');
const BNSResolvConf = require('bns/lib/resolvconf');

/*
 * Constants
 */

const HANDSHAKE_NS = [
  'am6p3cyyrawanjtd45bht3rvkwevwhmcknc3geu4tsjoprqnevyey@159.203.173.188', // github.com/publiusfederalist
  'aj5dp5chtw6m6ebhud3ltcuaciqd7s4fmoaxizgagfuio3dlxiouo@45.33.115.160'    // github.com/publiusfederalist
];

/**
 * ResolvConf
 * @extends bns.ResolvConf
 */

class ResolvConf extends BNSResolvConf {
  constructor() {
    super();
  }

  getHNS() {
    if (process.platform === 'win32') {
      const root = process.env.SystemRoot || 'C:\\Windows';
      return Path.join(root, '\\System32\\Drivers\\etc\\hns.conf');
    }

    return '/etc/hns.conf';
  }

  setDefault() {
    return this.setServers(HANDSHAKE_NS);
  }

  fromSystem() {
    super.fromSystem();

    this.clearServers();

    try {
      this.fromFile(this.getHNS());
    } catch (e) {
      this.setDefault();
    }

    if (this.ns4.length === 0
        && this.ns6.length === 0) {
      this.setDefault();
    }

    return this;
  }

  async fromSystemAsync() {
    await super.fromSystemAsync();

    this.clearServers();

    try {
      await this.fromFileAsync(this.getHNS());
    } catch (e) {
      this.setDefault();
    }

    if (this.ns4.length === 0
        && this.ns6.length === 0) {
      this.setDefault();
    }

    return this;
  }
}

/*
 * Expose
 */

module.exports = ResolvConf;
