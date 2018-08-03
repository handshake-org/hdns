'use strict';

const Path = require('path');
const BNSResolvConf = require('bns/lib/resolvconf');

/*
 * Constants
 */

const HANDSHAKE_NS = [
  'aoihqqagbhzz6wxg43itefqvmgda4uwtky362p22kbimcyg5fdp54@172.104.214.189',
  'ajk57wutnhfdzvqwqrgab3wwh4wxoqgnkz4avbln54pgj5jwefcts@172.104.177.177',
  'akimcha5bck7s344dmge6k3agtxd2txi6x4qzg3mo26spvf5bjol2@74.207.247.120'
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
