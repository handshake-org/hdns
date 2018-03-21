'use strict';

const API = require('bns/lib/api');
const Hosts = require('bns/lib/hosts');
const StubResolver = require('./stub');
const ResolvConf = require('./resolvconf');

let conf = null;
let hosts = null;

function createResolver(options, servers) {
  if (!conf)
    conf = ResolvConf.fromSystem();

  if (!hosts)
    hosts = Hosts.fromSystem();

  const resolver = new StubResolver(options);

  if (!options.conf)
    resolver.conf = conf.clone();

  if (!options.hosts)
    resolver.hosts = hosts.clone();

  if (servers)
    resolver.setServers(servers);

  return resolver;
}

module.exports = API.make(createResolver, {
  edns: true,
  dnssec: true
});
