"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTokenInLocalStorage = exports.Jobs = exports.PostJob = exports.Update = exports.Signin = exports.Signup = void 0;

var _axios = _interopRequireDefault(require("./axios"));

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

var _native = require("@react-navigation/native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Signup = function Signup(userData, endpoint) {
  var response;
  return regeneratorRuntime.async(function Signup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('success');
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("api/".concat(endpoint, "/signup"), userData));

        case 4:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log("================");
          console.log(_context.t0);
          throw _context.t0;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.Signup = Signup;

var Signin = function Signin(credentials, endpoint) {
  var response;
  return regeneratorRuntime.async(function Signin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("login");
          _context2.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("api/".concat(endpoint, "/login"), credentials));

        case 4:
          response = _context2.sent;

          if (!response.data.token) {
            _context2.next = 8;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('token', response.data.token));

        case 8:
          return _context2.abrupt("return", response.data);

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.Signin = Signin;

var Update = function Update(updateData, endpoint) {
  var existingToken, response;
  return regeneratorRuntime.async(function Update$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("update"); // Existing token (obtained from AsyncStorage or login)

          _context3.next = 4;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('token'));

        case 4:
          existingToken = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(_axios["default"].post("api/".concat(endpoint, "/update"), updateData, {
            headers: {
              Authorization: "Bearer ".concat(existingToken)
            }
          }));

        case 7:
          response = _context3.sent;

          if (!(response.status === 200)) {
            _context3.next = 12;
            break;
          }

          if (!response.data.token) {
            _context3.next = 12;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('token', response.data.token));

        case 12:
          return _context3.abrupt("return", response.data);

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.Update = Update;

var PostJob = function PostJob(jobData, endpoint) {
  var existingToken, response;
  return regeneratorRuntime.async(function PostJob$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log('success'); // Existing token (obtained from AsyncStorage or login)

          _context4.next = 4;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('token'));

        case 4:
          existingToken = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(_axios["default"].post("api/".concat(endpoint, "/postJob"), jobData, {
            headers: {
              Authorization: "Bearer ".concat(existingToken)
            }
          }));

        case 7:
          response = _context4.sent;
          return _context4.abrupt("return", response.data);

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.log("================");
          console.log(_context4.t0);
          throw _context4.t0;

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.PostJob = PostJob;

var Jobs = function Jobs(endpoint, role) {
  var existingToken, response;
  return regeneratorRuntime.async(function Jobs$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('token'));

        case 3:
          existingToken = _context5.sent;
          console.log(existingToken); // Include token in Authorization header

          _context5.next = 7;
          return regeneratorRuntime.awrap(_axios["default"].get("api/".concat(endpoint, "/shifts"), {
            headers: {
              Authorization: "Bearer ".concat(existingToken),
              Role: role
            }
          }));

        case 7:
          response = _context5.sent;
          console.log(response.data.jobData); // If the update is successful, you can potentially update the token in AsyncStorage

          if (!(response.status === 200)) {
            _context5.next = 15;
            break;
          }

          if (!response.data.token) {
            _context5.next = 13;
            break;
          }

          _context5.next = 13;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem('token', response.data.token));

        case 13:
          _context5.next = 16;
          break;

        case 15:
          if (response.status === 401) {
            console.log('Token is expired'); // navigation.navigate('Home')
          }

        case 16:
          return _context5.abrupt("return", response.data.jobData);

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          throw _context5.t0;

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.Jobs = Jobs;

var isTokenInLocalStorage = function isTokenInLocalStorage() {
  var token;
  return regeneratorRuntime.async(function isTokenInLocalStorage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_asyncStorage["default"].getItem('token'));

        case 3:
          token = _context6.sent;
          return _context6.abrupt("return", token !== null);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error('Error checking for token in localstorage:', _context6.t0);
          return _context6.abrupt("return", false);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.isTokenInLocalStorage = isTokenInLocalStorage;
//# sourceMappingURL=useApi.dev.js.map
