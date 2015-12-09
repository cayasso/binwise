'use strict';

import url from 'url';
import nock from 'nock';
import should from 'should';
import BinWise from '../lib/index';

const APP_ID = 'abc123';

describe('BinWise', function () {

  it('should expose a constructor', function () {
    BinWise.should.be.a.Function;
  });

  it('should throw error if application id is missing', function () {
    (() => {
     new BinWise(null);
    }).should.throw(/pass your BinWise Application ID/);
  });

  it('should set credential', function () {
    new BinWise('abc').auth.should.have.properties('app_id');
  });

  it('should allow passing options', function () {
    let binwise = new BinWise('abc', { 
      host: 'https://test.com'
    });
    binwise.host.should.be.eql('https://test.com');
  });

  describe('#getRestaurants', function () {

    let binwise = null;
    let query = null;
    let body = null;

    beforeEach(function () {

      binwise = new BinWise(APP_ID);
      
      nock('https://api.binwise.com')
        .get('/v1/call/rest/user/json/get_restaurants')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });
    });

    it('should call get restaurants endpoint', function (done) {
      binwise.getRestaurants(function (err) {
        if (err) return done(err);
        query.should.have.properties({ app_id: APP_ID });
        done();
      });
    });

    it('should get restaurants endpoint with options', function (done) {
      let obj = { page_size: 200 }; 
      binwise.getRestaurants(obj, function (err) {
        if (err) return done(err);
        query.should.have.properties({ app_id: APP_ID, page_size: '200' });
        done();
      });
    });

  });

  describe('#getPublishedLists', function () {

    let binwise = null;
    let query = null;
    let body = null;

    beforeEach(function () {

      binwise = new BinWise(APP_ID);
      
      nock('https://api.binwise.com')
        .get('/v1/call/rest/restaurant/json/get_published_lists')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });
    });

    it('should call get published lists endpoint', function (done) {
      binwise.getPublishedLists('abc123xxx', function (err) {
        if (err) return done(err);
        query.should.have.properties({ app_id: APP_ID, restaurant_id: 'abc123xxx' });
        done();
      });
    });

    it('should throw error if restaurant id is missing', function () {
      (function(){
        binwise.getPublishedLists(null, function (err) {});
      }).should.throw(/pass a Restaurant ID as first parameter/);
    });

  });


  describe('#getWineList', function () {

    let binwise = null;
    let query = null;
    let body = null;

    beforeEach(function () {

      binwise = new BinWise(APP_ID);
      
      nock('https://api.binwise.com')
        .get('/v1/call/rest/restaurant/json/get_wine_list')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });
    });

    it('should call get wine list endpoint', function (done) {
      binwise.getWineList('abc123xxx', function (err) {
        if (err) return done(err);
        query.should.have.properties({ app_id: APP_ID, list_id: 'abc123xxx' });
        done();
      });
    });

    it('should throw error if list id is missing', function () {
      (function(){
        binwise.getWineList(null, function (err) {});
      }).should.throw(/pass a List ID as first parameter/);
    });

  });
  

});