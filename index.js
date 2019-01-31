var utility = require('./lib/utility'),
    client = require('./lib/client'),
    endpoints = require('./lib/endpoints'),
    Js2Xml = require("./lib/js2xml"),
    extend = require('extend');

var recurly = function(config) {
  var clientObj = new client(config);

  /* Doc: https://docs.recurly.com/api/accounts */
  this.accounts = {
    list: async function(filter, cb) {
      return clientObj.request(utility.addQueryParams(endpoints.accounts.list, filter), cb);
    },
    get: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.accounts.get, {account_code: accountCode}), cb);
    },
    create: async function(obj, cb) {
      return clientObj.request(endpoints.accounts.create, new Js2Xml("account", obj).toString(), cb);
    },
    update: async function(accountCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.accounts.update, {account_code: accountCode}), new Js2Xml("account", obj).toString(), cb);
    },
    close: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.accounts.close, {account_code: accountCode}), cb);
    },
    reopen: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.accounts.reopen, {account_code: accountCode}), cb);
    },
    notes: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.accounts.notes, {account_code: accountCode}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/adjustments */
  this.adjustments = {
    list: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.adjustments.list, {account_code: accountCode}), cb);
    },
    get: async function(uuid, filters, cb) {
      if (typeof filters == 'function') {
        cb = filters;
        filters = null;
      }
      var paramObj = {uuid: uuid};
      if (filters) paramObj = extend(true, paramObj, filters);
      return clientObj.request(utility.addParams(endpoints.adjustments.get, paramObj), cb);
    },
    create: async function(accountCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.adjustments.create, {account_code: accountCode}), new Js2Xml("adjustments", obj).toString(), cb);
    },
    remove: async function(uuid, cb) {
      return clientObj.request(utility.addParams(endpoints.adjustments.remove, {uuid: uuid}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/billing-info */
  this.billingInfo = {
    get: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.billingInfo.get, {account_code: accountCode}), cb);
    },
    update: async function(accountCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.billingInfo.update, {account_code: accountCode}), new Js2Xml("billing_info", obj).toString(), cb);
    },
    remove: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.billingInfo.remove, {account_code: accountCode}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/coupons */
  this.coupons = {
    list: async function(filter, cb) {
      return clientObj.request(utility.addQueryParams(endpoints.coupons.list, filter), cb);
    },
    get: async function(couponCode, cb) {
      return clientObj.request(utility.addParams(endpoints.coupons.get, {coupon_code: couponCode}), cb);
    },
    create: async function(obj, cb) {
      return clientObj.request(endpoints.coupons.create, new Js2Xml("coupon", obj).toString(), cb);
    },
    deactivate: async function(couponCode, cb) {
      return clientObj.request(utility.addParams(endpoints.coupons.deactivate, {coupon_code: couponCode}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/coupons/coupon-redemption */
  this.couponRedemption = {
    redeem: async function(couponCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.couponRedemption.redeem, {coupon_code: couponCode}), new Js2Xml("redemption", obj).toString(), cb);
    },
    get: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.couponRedemption.get, {account_code: accountCode}), cb);
    },
    remove: async function(accountCode, cb) {
      return clientObj.request(utility.addParams(endpoints.couponRedemption.remove, {account_code: accountCode}), cb);
    },
    getByInvoice: async function(invoiceNumber, cb) {
      return clientObj.request(utility.addParams(endpoints.couponRedemption.getByInvoice, {invoice_number: invoiceNumber}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/invoices */
  this.invoices = {
    list: async function(filter, cb) {
      return clientObj.request(utility.addQueryParams(endpoints.invoices.list, filter), cb);
    },
    listByAccount: async function(accountCode, filter, cb) {
      if (typeof filter == 'function') {
        cb = filter;
        filter = null;
      }

      var routeObject = endpoints.invoices.listByAccount;
      if (filter) utility.addQueryParams(routeObject, filter);

      return clientObj.request(utility.addParams(routeObject, {account_code: accountCode}), cb);
    },
    get: async function(invoiceNumber, cb) {
      return clientObj.request(utility.addParams(endpoints.invoices.get, {invoice_number: invoiceNumber}), cb);
    },
    create: async function(accountCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.invoices.create, {account_code: accountCode}), new Js2Xml("invoice", obj).toString(), cb);
    },
    markSuccessful: async function(invoiceNumber, cb) {
      return clientObj.request(utility.addParams(endpoints.invoices.markSuccessful, {invoice_number: invoiceNumber}), cb);
    },
    markFailed: async function(invoiceNumber, cb) {
      return clientObj.request(utility.addParams(endpoints.invoices.markFailed, {invoice_number: invoiceNumber}), cb);
    },
    refund: async function(invoiceNumber, obj, cb) {
      if (typeof obj == 'function') {
        cb = obj;
        obj = { };
      }
      return clientObj.request(utility.addParams(endpoints.invoices.refund, {invoice_number: invoiceNumber}), new Js2Xml("invoice", obj).toString(), cb);
    },
    offline: async function(invoiceNumber, cb) {
      return clientObj.request(utility.addParams(endpoints.invoices.offline, {invoice_number: invoiceNumber}), cb);
    },
    subscriptions: async function (invoiceNumber, cb) {
      return clientObj.request(utility.addParams(endpoints.invoices.subscriptions, {invoice_number: invoiceNumber}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/plans */
  this.plans = {
    list: async function(cb, filter) {
      return clientObj.request(utility.addQueryParams(endpoints.plans.list, filter), cb);
    },
    get: async function(planCode, cb) {
      return clientObj.request(utility.addParams(endpoints.plans.get, {plan_code: planCode}), cb);
    },
    create: async function(obj, cb) {
      return clientObj.request(endpoints.plans.create, new Js2Xml("plan", obj).toString(), cb);
    },
    update: async function(planCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.plans.update, {plan_code: planCode}), new Js2Xml("plan", obj).toString(), cb);
    },
    remove: async function(planCode, cb) {
      return clientObj.request(utility.addParams(endpoints.plans.remove, {plan_code: planCode}), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/plans/add-ons */
  this.planAddons = {
    list: async function(planCode, cb, filter) {
      return clientObj.request(utility.addParams(utility.addQueryParams(endpoints.planAddons.list, filter), {plan_code: planCode}), cb);
    },
    get: async function(planCode, addonCode, cb) {
      return clientObj.request(utility.addParams(endpoints.planAddons.get, {plan_code: planCode, addon_code: addonCode}), cb);
    },
    create: async function(planCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.planAddons.create, {plan_code: planCode}), new Js2Xml("add_on", obj).toString(), cb);
    },
    update: async function(planCode, addonCode, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.planAddons.update, {plan_code: planCode, add_on_code: addonCode}), new Js2Xml("add_on", obj).toString(), cb);
    },
    remove: async function(planCode, addonCode, cb) {
      return clientObj.request(utility.addParams(endpoints.planAddons.remove, {plan_code: planCode, add_on_code: addonCode}), cb);
    }
  };

  /* Doc: https://dev.recurly.com/docs/create-purchase */
  this.purchases = {
    create: async function(obj, cb) {
      return clientObj.request(endpoints.purchases.create, new Js2Xml("purchase", obj).toString(), cb);
    },
    preview: async function(obj, cb) {
      return clientObj.request(endpoints.purchases.preview, new Js2Xml("purchase", obj).toString(), cb);
    },
    authorize: async function(obj, cb) {
      return clientObj.request(endpoints.purchases.authorize, new Js2Xml("purchase", obj).toString(), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/subscriptions */
  this.subscriptions = {
    list: async function(cb, filter) {
      return clientObj.request(utility.addQueryParams(endpoints.subscriptions.list, filter), cb);
    },
    listByAccount: async function(accountCode, params, cb) {
      if (typeof params == 'function') {
        cb = params;
        params = null;
      }
      return clientObj.request(utility.addParams(utility.addQueryParams(endpoints.subscriptions.listByAccount, params), {account_code: accountCode}), cb);
    },
    get: async function(uuid, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.get, {uuid: uuid}), cb);
    },
    create: async function(obj, cb) {
      return clientObj.request(endpoints.subscriptions.create, new Js2Xml("subscription", obj).toString(), cb);
    },
    update: async function(uuid, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.update, {uuid: uuid}), new Js2Xml("subscription", obj).toString(), cb);
    },
    cancel: async function(uuid, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.cancel, {uuid: uuid}), cb);
    },
    reactivate: async function(uuid, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.reactivate, {uuid: uuid}), cb);
    },
    terminate: async function(uuid, refundType, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.terminate, {uuid: uuid, refund_type: refundType}), cb);
    },
    postpone: async function(uuid, nextRenewalDate, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.postpone, {uuid: uuid, next_renewal_date: nextRenewalDate}), cb);
    },
    preview: async function(obj, cb) {
      return clientObj.request(endpoints.subscriptions.preview, new Js2Xml("subscription", obj).toString(), cb);
    },
    previewChange: async function(uuid, obj, cb) {
      return clientObj.request(utility.addParams(endpoints.subscriptions.previewChange, {uuid: uuid}), new Js2Xml('subscription', obj).toString(), cb);
    }
  };

  /* Doc: https://docs.recurly.com/api/transactions */
  this.transactions = {
    list: async function(cb, filter) {
      return clientObj.request(utility.addQueryParams(endpoints.transactions.list, filter), cb);
    },
    listByAccount: async function(accountCode, cb, filter) {
      return clientObj.request(utility.addParams(utility.addQueryParams(endpoints.transactions.listByAccount, filter), {account_code: accountCode}), cb);
    },
    get: async function(id, cb) {
      return clientObj.request(utility.addParams(endpoints.transactions.get, {'id': id}), cb);
    },
    create: async function(obj, cb) {
      return clientObj.request(endpoints.transactions.create, new Js2Xml("transaction", obj).toString(), cb);
    },
    refund: async function(id, cb, amount) {
      var route = utility.addParams(endpoints.transactions.refund, {id: id});
      if (amount) {
        route = utility.addQueryParams(route, { amount_in_cents: amount });
      }
      return clientObj.request(route, cb);
    }
  };

};

module.exports = recurly;
