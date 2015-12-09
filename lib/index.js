'use strict';

/**
 * Module dependencies.
 */

import dbg from 'debug';
import assert from 'assert';
import * as utils from './utils';
import request from 'superagent';
import _ from 'lodash';

/**
 * Module variables.
 */

const debug = dbg('binwise');
const type = 'application/json';
const host = 'https://api.binwise.com/v1/call/rest';

export default class BinWise {

  /**
   * Initialize binwise object.
   *
   * @param {String} appId
   * @param {Object} options
   * @return {BinWise}
   * @api public
   */

  constructor(appId, options) {
    assert(appId, 'You must pass your BinWise Application ID.');
    options = options || {};
    this.auth = { app_id: appId };
    this.host = options.host || host;
  }

  /**
   * Verify address.
   *
   * @param {Object} [options]
   * @param {Function} fn
   * @return {BinWise}
   * @api public
   */

  getRestaurants(options, fn) {

    if ('function' === typeof options) {
      fn = options;
      options = {};
    }
    options = options || {};
    let path = 'user/json/get_restaurants';

    this.request('get', path, options, fn);
  }

  /**
   * Suggest addreses for autocomplete.
   *
   * @param {String} restaurantId
   * @param {Function} fn
   * @return {BinWise}
   * @api public
   */

  getPublishedLists(restaurantId, fn) {
    assert(restaurantId, 'You must pass a Restaurant ID as first parameter.');
    let path = 'restaurant/json/get_published_lists';
    this.request('get', path, { restaurantId }, fn);
  }

  /**
   * Suggest addreses for autocomplete.
   *
   * @param {String} listId
   * @param {Function} fn
   * @return {BinWise}
   * @api public
   */

  getWineList(listId, fn) {
    assert(listId, 'You must pass a List ID as first parameter.');
    let path = 'restaurant/json/get_wine_list';
    this.request('get', path, { listId }, (err, json) => {
      if (err) return fn(err);
      fn(null, json ? utils.normalizeWineList(json) : json);
    });
  }

  /**
   * Perform http request.
   *
   * @param {String} method
   * @param {String} endpoint
   * @param {Object} data
   * @param {Function} fn
   * @api private
   */

  request(method, endpoint, data, fn) {
    let req = null;
    let auth = this.auth;
    let url = this.host + '/' + endpoint;
    data = data || {};
    debug('enpoint %s request: %o', endpoint, data);
    req = this[method](url, utils.snakify(data));
    req.end(this.response(endpoint, fn));
  }

  /**
   * Handle http response.
   *
   * @param {String} endpoint
   * @param {Function} fn
   * @api private
   */

  response(endpoint, fn) {
    return (err, res) => {
      let data = null;
      let body = null;
      err = err || utils.error(res);
      if (err) return fn(err);
      try {
        if ('text/json' === res.headers['content-type']) {
          body = JSON.parse(res.text);
        } else {
          body = res.body;
        }
      } catch (e) {
        err = e;
      } finally {
        data = utils.camelize(body);
        debug('enpoint %s request: %o', endpoint, data);
        fn(err, data, body);
      }
    }
  }

  /**
   * Http GET method.
   *
   * @param {String} url
   * @param {Object} data
   * @return {Object}
   * @api private
   */

  get(url, data) {
    return request
      .get(url)
      .query(this.auth)
      .query(data)
      .set('Accept', type);
  }

  /**
   * Http POST method.
   *
   * @param {String} url
   * @param {Object} data
   * @return {Object}
   * @api private
   */

  post(url, data) {
    return request
      .post(url)
      .query(this.auth)
      .send(data)
      .set('Accept', type);
  }

}