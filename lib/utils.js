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
    res = [];
    obj.forEach(function each(item) {
      res.push(camelize(item));
    });
  } else {
    Object.keys(obj).forEach(function each(key) {
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
    res = [];
    obj.forEach(function each(item) {
      res.push(snakify(item));
    });
  } else {
    Object.keys(obj).forEach(function each(key) {
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
 * Normalize pages.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function normalizePages(obj) {
  obj.content = obj.content || {};
  obj.content.pages = obj.content.pages || [];
  obj.content.list && obj.content.list.forEach(p => {
    delete p.inventoryDescription;
    delete p.listDescription;
    let categories = [];
    let counter = 0;
    p.list.forEach(o => {
      if ('text' === o.type) {
        categories[counter] = o;
        categories[counter].folders = [];
        counter++;
      } else {
        o.list.forEach(t => delete t.type)
        categories[counter - 1].folders.push(o);
      }
      delete o.type;
    });
    obj.content.pages = [obj.content.pages, ...categories];
  });
  delete obj.content.list;
  return obj;
};

/**
 * Normalize list fields.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function normalizeLists(obj) {
  let folders = [];
  if (!obj || 'string' === typeof obj) return;
  if (Array.isArray(obj)) {
    obj.forEach(normalizeLists);
  } else {
    Object.keys(obj).forEach(k => {
      let val = obj[k];
      if ('nodeList' === k && val.node) {
        val = obj.list = Array.isArray(val.node) ? val.node : [val.node];
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
  normalizePages(obj);
  return obj;
}
