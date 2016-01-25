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
 * Normalize pages.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function normalizePages(pages) {
  pages.forEach(page => {
    if ('page' === page.type) {
      let i = -1;
      let texts = [];
      page.list.forEach(folder => {
        if ('text' === folder.type) {
          i++;
          texts[i] = folder;
          texts[i].list = [];
        } else {
          if (texts[i]) {
            texts[i].list.push(folder);
          }
        }
        delete folder.type;
      });
      page.list = texts;
      delete page.type;
    }
  });
  return pages;
}

/**
 * Normalize list fields.
 *
 * @param {Object} obj
 * @return {Object}
 */

export function normalizeLists(obj) {
  let folders = [];
  if (!obj || 'string' === typeof obj) return;
  if (isArray(obj)) {
    obj.forEach(normalizeLists);
  } else {
    Object.keys(obj).forEach(k => {
      let val = obj[k];
      if ('nodeList' === k && val.node) {
        val = obj.list = isArray(val.node) ? val.node : [val.node];
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
  if (obj.content) {
    normalizeLists(obj.content);
    if (isArray(obj.content.list)) {
      normalizePages(obj.content.list);
    }
  }
  obj.content = obj.content || {};
  return obj.content.list || [];
}
