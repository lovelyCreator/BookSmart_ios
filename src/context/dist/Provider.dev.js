"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthContext = exports.signatureAtom = exports.passwordAtom = exports.photoImageAtom = exports.addressAtom = exports.verifiedSocialSecurityNumberAtom = exports.socialSecurityNumberAtom = exports.birthdayAtom = exports.titleAtom = exports.phoneNumberAtom = exports.emailAtom = exports.lastNameAtom = exports.firstNameAtom = void 0;

var _react = _interopRequireDefault(require("react"));

var _jotai = require("jotai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var firstNameAtom = atom('');
exports.firstNameAtom = firstNameAtom;
var lastNameAtom = atom('');
exports.lastNameAtom = lastNameAtom;
var emailAtom = atom('');
exports.emailAtom = emailAtom;
var phoneNumberAtom = atom('');
exports.phoneNumberAtom = phoneNumberAtom;
var titleAtom = atom('');
exports.titleAtom = titleAtom;
var birthdayAtom = atom(new Date());
exports.birthdayAtom = birthdayAtom;
var socialSecurityNumberAtom = atom('');
exports.socialSecurityNumberAtom = socialSecurityNumberAtom;
var verifiedSocialSecurityNumberAtom = atom('');
exports.verifiedSocialSecurityNumberAtom = verifiedSocialSecurityNumberAtom;
var addressAtom = atom({
  streetAddress: '',
  streetAddress2: '',
  city: '',
  state: '',
  zip: ''
});
exports.addressAtom = addressAtom;
var photoImageAtom = atom('');
exports.photoImageAtom = photoImageAtom;
var passwordAtom = atom('');
exports.passwordAtom = passwordAtom;
var signatureAtom = atom('');
exports.signatureAtom = signatureAtom;

var AuthContext = _react["default"].createContext();

exports.AuthContext = AuthContext;

var AuthProvider = function AuthProvider(_ref) {
  var children = _ref.children;
  return;
};
//# sourceMappingURL=Provider.dev.js.map
