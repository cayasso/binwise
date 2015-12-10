'use strict';

/**
 * Module dependencies.
 */

import dbg from 'debug';
import assert from 'assert';
import * as utils from './utils';
import superagent from 'superagent';
import _ from 'lodash';

/**
 * Module variables.
 */

const debug = dbg('binwise');
const type = 'application/json';
const HOST = 'https://api.binwise.com/v1/call/rest';

export default class BinWise {

  /**
   * Initialize binwise object.
   *
   * @param {String} appId
   * @param {Object} options
   * @return {BinWise}
   * @api public
   */

  constructor(appId, options = { host: HOST }) {

    assert(appId, 'You must pass your BinWise Application ID.');
    
    options = options || {};
    
    const auth = { app_id: appId };
    const { host } = options;

    const get = (url, data) => {
      return superagent
        .get(url)
        .query(auth)
        .query(data)
        .set('Accept', type);
    };

    const post = (url, data) => {
      return superagent
        .post(url)
        .query(auth)
        .send(data)
        .set('Accept', type);
    };

    const methods = { get, post };

    const response = (endpoint, fn) => {
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
    };

    const request = (method, endpoint, data, fn) => {
      let req = null;
      let url = `${host}/${endpoint}`;
      data = data || {};
      debug('enpoint %s request: %o', endpoint, data);
      req = methods[method](url, utils.snakify(data));
      req.end(response(endpoint, fn));
    }

    return Object.freeze({

      /**
       * Get restaurants.
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
        request('get', path, options, fn);
      },

      /**
       * Get published lists.
       *
       * @param {String} restaurantId
       * @param {Function} fn
       * @return {BinWise}
       * @api public
       */

      getPublishedLists(restaurantId, fn) {
        assert(restaurantId, 'You must pass a Restaurant ID as first parameter.');
        let path = 'restaurant/json/get_published_lists';
        request('get', path, { restaurantId }, fn);
      },

      /**
       * Get wine list.
       *
       * @param {String} listId
       * @param {Function} fn
       * @return {BinWise}
       * @api public
       */

      getWineList(listId, fn) {
        assert(listId, 'You must pass a List ID as first parameter.');
        let path = 'restaurant/json/get_wine_list';
        request('get', path, { listId }, (err, json) => {
          if (err) return fn(err);
          fn(null, json ? utils.normalizeWineList(json) : json);
        });
      },

      get auth() { return auth; },
      get host() { return host; }

    });
  }

}