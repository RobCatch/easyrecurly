var Js2Xml = require("js2xml").Js2Xml,
    pluralisations = {
      'subscriptions': 'subscription',
      'subscription_add_ons': 'subscription_add_on',
      'line_items': 'adjustment',
      'plan_codes': 'plan_code',
      'coupon_codes': 'coupon_code',
      'custom_fields': 'custom_field'
    };

function js2xml() {
  Js2Xml.apply(this, arguments);
}

js2xml.prototype = Object.create(Js2Xml.prototype);
js2xml.prototype.pluralisation = function (name) {
  return pluralisations[name] || 'item';
}

module.exports = js2xml;
