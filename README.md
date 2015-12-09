# binwise

[![Build Status](https://travis-ci.org/cayasso/binwise.png?branch=master)](https://travis-ci.org/cayasso/binwise)
[![NPM version](https://badge.fury.io/js/binwise.png)](http://badge.fury.io/js/binwise)

Simple BinWise API wrapper.

## Installation

``` bash
$ npm install binwise
```

## Usage

```javascript
var BinWise = require('binwise');
var binwise = new BinWise(APP_ID, [options]);

binwise.getRestaurants({ pageSize: 100 }, function (err, data, raw) {
  if (err) return console.error(err);
  console.log(data);
});

binwise.getPublishedLists('abcd123', function (err, data, raw) {
  if (err) return console.error(err);
  console.log(data);
});

binwise.getWineList('abcd123', function (err, data, raw) {
  if (err) return console.error(err);
  console.log(data);
});

// err => Error object
// data => formated return data
// raw => unformated raw data from BinWise
```

## API

### BinWise(appId, [options])

`appId` and `authToken` are required.

Options are:

* `host`: Api host.

### getRestaurants([options], fn)

Returns the list of restaurants that you have access to and their IDs.

### getPublishedLists(restaurantId, fn)

Returns a list of wine lists published for a specific restaurants.

### getWineList(listId, fn)

Returns the data for a particular wine list for a particular restaurant.

## Run tests

``` bash
$ npm install
$ make test
```

## License

(The MIT License)

Copyright (c) 2016 Jonathan Brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
