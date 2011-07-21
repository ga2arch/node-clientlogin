(function() {
  var ClientLogin, http, https, querystring;
  http = require('http');
  https = require('https');
  querystring = require('querystring');
  ClientLogin = (function() {
    function ClientLogin(username, password, service, accountType) {
      if (accountType == null) {
        accountType = 'HOSTED_OR_GOOGLE';
      }
      this.username = username;
      this.password = password;
      this.service = service;
      this.accountType = accountType;
    }
    ClientLogin.prototype.authorize = function(callback) {
      var options, postData, req, self;
      self = this;
      postData = querystring.stringify({
        'Email': this.username,
        'Passwd': this.password,
        'service': this.service,
        'accountType': this.accountType
      });
      options = {
        host: 'www.google.com',
        path: '/accounts/ClientLogin',
        port: 443,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      };
      req = https.request(options, function(res) {
        var data;
        data = '';
        res.setEncoding('utf-8');
        res.on('data', function(chuck) {
          return data += chuck;
        });
        return res.on('end', function() {
          self.sid = data.split('SID=')[1].split('Auth')[0];
          self.authToken = data.split('Auth=')[1];
          return callback();
        });
      });
      req.write(postData);
      return req.end();
    };
    return ClientLogin;
  })();
  module.exports = ClientLogin;
}).call(this);
