var request = require('request'),
    xml = require('./xml'),
    RecurlyError = require('./error');

module.exports = function(config) {

  this.request = function(route, data, options, cb) {
    if (typeof data == 'function') {
      cb = data;
      data = null;
      options = {};
    } else if (typeof options == 'function') {
      cb = options;
      options = {};
    }

    var self = this;
        url = route[0],
        method = route[1],
        defaultOptions = {
      url: config.subdomain + url,
      method: method,
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/xml; charset=utf-8',
        'X-Api-Version': config.apiVersion
      },
      auth: {
        user: config.apiKey,
        pass: '',
        sendImmediately: true
      },
      body: data
    };

    options = Object.assign(defaultOptions, options);

    //console.log('Options: ', options);
    return new Promise(function (resolve, reject) {
      let errHandler = cb || reject;
      request(options, function(e, res, body) {
        if (e) return errHandler(e);
        //console.log('isXML: ', res.headers);
        if (options.headers.Accept == 'application/xml') {
          try {
            var parsedXml = xml.xml2js(body);
            if (config.debug) self._debug(res, parsedXml);
            var apiError = self._parseError(res, parsedXml);
            if (apiError) return errHandler(apiError);
            const response = self._wrapResponse(res, parsedXml);
            cb && cb(null, response);
            return resolve(response);
          } catch (e) {
            return errHandler(e);
          }
        } else {
          if (config.debug) self._debug(res, body);
          var apiError = self._parseError(res, body);
          if (apiError.length) return errHandler(apiError);
          const response = self._wrapResponse(res, body);
          cb && cb(null, response);
          return resolve(response);
        }
      });
    });
  };


  this._wrapResponse = function(res, body) {
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: body
    };
  };

  this._parseError = function(res, body) {
    if (body && (body.error || body.errors || body.transaction_error)) {
      newError = new RecurlyError(body);
      if (newError.message || newError.errors.length) return newError;
    } else if (res.statusCode >= 400 && res.statusCode <= 499) { // Client Request Error
      //console.log('Recurly Error Body: ', body);
      var err = new Error('Client Request Error: status code ' + res.statusCode);
      err.body = body;
      return err;
    } else if (res.statusCode >= 500 && res.statusCode <= 599) { // Server Error
      return new Error('Recurly Server Error: status code ' + res.statusCode);
    }
    return null;
  };

  this._debug = function(res, body) { console.log('DEBUG: ', res.statusCode, ' \n', body); };
};
