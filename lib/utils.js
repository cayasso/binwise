'use strict';

/**
 * Module dependencies.
 */

import _ from 'lodash';

/**
 * Module letiables.
 */

const isArray = Array.isArray;

/**
 * Converts object letiables to camel case.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function camelize(obj) {
  if (!obj) return;
  if ('string' === typeof obj) {
    return _.camelCase(obj);
  }
  let res = Object.create(null);
  if (isArray(obj)) {
    res = obj.map(i => camelize(i));
  } else {
    Object.keys(obj).forEach(key => {
      let val = obj[key];
      let ckey = _.camelCase(key);
      res[ckey] = obj[key];
      if ('object' === typeof val) {
        res[ckey] = camelize(val);
      }
    });
  }
  return res;
}

/**
 * Converts object letiables to snake case.
 *
 * @param {Object} obj
 * @return {Object}
 */

export  function snakify(obj) {
  if (!obj) return;
  if ('string' === typeof obj) {
    return _.snakeCase(obj);
  }
  let res = Object.create(null);
  if (isArray(obj)) {
    res = obj.map(i => snakify(i));
  } else {
    Object.keys(obj).forEach(key => {
      let val = obj[key];
      let ckey = _.snakeCase(key);
      res[ckey] = obj[key];
      if ('object' === typeof val) {
        res[ckey] = snakify(val);
      }
    });
  }
  return res;
};

/**
 * Get an error from a `res`.
 *
 * @param {Object} res
 * @return {String}
 */

export function error(res) {
  if (!res || !res.error) return;
  let body = res.body;
  let msg = body.error && body.error.message
    || res.status + ' ' + res.text;
  return new Error(msg);
};

/**
 * Normalize list fields.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function normalizeLists(obj) {
  if (!obj || 'string' === typeof obj) return;
  if (isArray(obj)) {
    obj.forEach(normalizeLists);
  } else {
    Object.keys(obj).forEach(key => {
        let val = obj[key];
        let node = null;
        if ('nodeList' === key && (node = val.node)) {
          obj.list = isArray(node) ? node : [node];
          delete obj.nodeList;
        }
        if ('object' === typeof val) normalizeLists(val);
    });
  }
  return obj;
}

/**
 * Normalize wine list fields.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function normalizeWineList(obj) {
  normalizeLists(obj);
  obj.content = obj.content || {};
  return obj.content.list || [];
}
