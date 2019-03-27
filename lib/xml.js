var xmlJs = require("xml-js"),
    pluralisations = {
      'subscriptions': 'subscription',
      'subscription_add_ons': 'subscription_add_on',
      'line_items': 'adjustment',
      'plan_codes': 'plan_code',
      'coupon_codes': 'coupon_code',
      'custom_fields': 'custom_field'
    };

module.exports.js2xml = function (rootName, obj) {
  var _obj = {};
  _obj[rootName] = _setPluralisations(obj);
  return xmlJs.js2xml(_obj, { compact: true });
}

/**
 * Apply pluralisation as xml-js expect, e.g. subscriptions: [ ... ] -> subscriptions: { subscription: [ ... ] }
 * @param {Object} obj object to be converted to xml
 */
function _setPluralisations (obj) {
  var _obj = {};
  Object.keys(obj).forEach(function (k) {
    var v = obj[k],
      isArray = Array.isArray(v);
    // If the value is an array and the key has a pluralisation then apply it
    if (isArray && pluralisations[k]) {
      _obj[k] = {};
      return _obj[k][pluralisations[k]] = v.map(_setPluralisations);
    }
    // Call recursively
    _obj[k] = isArray ? v.map(_setPluralisations)
      : typeof v === 'object' ? _setPluralisations(v)
        : v;
  });
  return _obj;
}

module.exports.xml2js = function (xml) {
  var result = _parseXmlResult(xmlJs.xml2js(xml, { compact: true }));
  // Omit the root object
  delete result._declaration;
  var rootName = Object.keys(result)[0];
  return result[rootName];
}

/**
 * Parse the result of xml2js. Removes pluralisation nesting and sets types.
 * 
 * @param {Object} obj parsed xml object
 */
function _parseXmlResult(obj) {
  obj && obj._attributes && (delete obj._attributes);
  obj && obj._declaration && (delete obj._declaration);
  Object.keys(obj).forEach(function (k) {
    var v = obj[k],
      singular = pluralisations[k],
      attrs = v._attributes,
      type = attrs && attrs.type,
      subObject = v && type === 'array' && v[singular];
    delete v._attributes;
    // Remove pluralisation nesting
    if (subObject) {
      obj[k] = v = (Array.isArray(subObject) ? subObject : [ subObject ]);
    }
    var text = v._text,
      nil = attrs && attrs.nil;
    // Set _text as the value, applying any type, and fall out
    if (text || nil) {
      obj[k] = type === 'datetime' ? new Date(text)
        : type === 'integer' ? parseInt(text, 10)
          : type === 'boolean' ? (text === 'true' ? true : false)
            : nil ? null
              : text;
      return;
    }

    // Set any attributes on the object
    if (attrs) {
      delete attrs.type;
      delete attrs.nil;
      Object.keys(attrs).forEach(function (aKey) {
        v[aKey] = attrs[aKey];
      });
    }

    if (Array.isArray(v)) {
      v.forEach(function (value) {
        _parseXmlResult(value);
      });
    } else if (typeof v === 'object') {
      // Turn empty objects into empty strings
      if (Object.keys(v).length === 0) {
        return obj[k] = '';
      }
      _parseXmlResult(v);
    }
  });
  return obj;
}
