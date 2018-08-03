# HDNS

Drop-in DNS replacement for node.js to resolve names over the handshake
network.

## Usage

``` js
const dns = require('hdns');
console.log(await dns.lookup('google.com', { all: true }));
```

The API is nearly identical to node.js, aside from it being promised based.

That said, we do have some extra goodies now that HNS+DNS+DNSSEC can be used as
a means for provability.

## Verifying TLS certs

``` js
const dns = require('hdns');
const tlsa = await dns.resolveTLSA('foo.example.com', 'tcp', 443);

if (tlsa.length > 0) {
  console.dir(tlsa);
  // Passing a raw ASN1 certificate buffer:
  if (dns.verifyTLSA(tlsa[0], cert))
    console.log('Valid!');
}
```

The above will return all matching TLSA records with their respective usages,
selectors, matching types, and fingerprints.

The call will throw an error if the DNSSEC trust chain was broken, or if a
SIG(0) verification fails. If the TLSA record is directly on the blockchain
itself, the only thing relevant is the SIG(0) record, which is only necessary
when the user is not running a local SPV node.

### Suggestion

If TLS certs were verified via an external server and verified with SIG(0),
this should be the equivalent of a "grey lock" icon. If the DNS response came
from a local handshake SPV resolver, it should be the equivalent to the "green
lock" icon. The rationale here is that keys used for SIG(0) need to be kept hot
and are much more susceptible to compromise. With a local SPV node, the only
signatures being validated are for DNSSEC. DNSSEC keys are much more secure in
that they can be stored offline.

## Verifying SSH fingerprints

``` js
const dns = require('hdns');
const sshfp = await dns.resolveSSHFP('foo.example.com');

if (sshfp.length > 0) {
  console.dir(sshfp);
  // Passing a raw ssh key buffer:
  if (dns.verifySSHFP(sshfp[0], key))
    console.log('Valid!');
}
```

The above will return all matching SSHFP records with their respective
algorithms and fingerprints.

Like TLSA, this will throw on any sort of security failure.

## Configuration

Handshake specifies a new OS configuration file known as `hns.conf`. This
file is nearly identical to resolv.conf except that it allows for nameserver
public keys and nameserver ports. An example might be:

``` bash
$ cat /etc/hns.conf
nameserver aorsxa4ylaacshipyjkfbvzfkh3jhh4yowtoqdt64nzemqtiw2whk@127.0.0.1:5359
```

IP addresses associated with ECDSA keys are prefixed with a base32-encoded
secp256k1 key (compressed). If no key is placed before the IP address, SIG(0)
validation will be not be performed.

## Usage in Node.js

TCP and UDP sockets in node.js usually allow you to pass a custom `lookup`
function for DNS resolution. This includes the HTTP module.

This module provides a compatibility lookup function called `legacy`, which is
basically a callback wrapper around `hdns.lookup`.

Example:

``` js
const dns = require('hdns');
const http = require('http');

http.get({
  protocol: 'http:',
  hostname: 'icanhazip.com',
  lookup: dns.legacy
}, (res) => {
  res.setEncoding('utf8');
  res.on('data', (data) => {
    console.log(data);
  });
});
```

## Digging

HDNS comes with a dig-like tool called `hdig.js`.

``` bash
$ hdig.js @akqq3xoch6cgluhgqh2n7lm4lh4d2zjuzyiekudx6d37xckhp26dg@127.0.0.1 -p 53 www.ietf.org +dnssec

; <<>> hdig.js 0.0.0 <<>> @akqq3xoch6cgluhgqh2n7lm4lh4d2zjuzyiekudx6d37xckhp26dg@127.0.0.1 -p 53 www.ietf.org +dnssec
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 20186
;; flags: qr rd ra ad, QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 2

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags: do, udp: 4096
;; QUESTION SECTION:
;www.ietf.org. IN A

;; ANSWER SECTION:
www.ietf.org. 1800 IN CNAME www.ietf.org.cdn.cloudflare.net.
www.ietf.org.cdn.cloudflare.net. 300 IN A 104.20.1.85
www.ietf.org.cdn.cloudflare.net. 300 IN A 104.20.0.85

;; SIG0 PSEUDOSECTION:
. 0 ANY SIG 0 253 0 0 20180321132604 20180321131404 0 . h+SGk9niEFUeAkwQdQnuP8Tyvk2sMGLSF/FwHCEQnhghPZHwnKALtuu3 NIjFm8krfX/6TWsixnm0ZbyTDAZtRQ==  ; alg = PRIVATEDNS

;; Query time: 1066 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Wed Mar 21 06:20:04 PDT 2018
;; MSG SIZE  rcvd: 286
```

This is a query to our local SPV node. Note the SIG(0) signature in the
additional section: this isn't technically necessary for local SPV nodes, but
it's nice to have for remote servers.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2018, Christopher Jeffrey (MIT License).

See LICENSE for more info.
