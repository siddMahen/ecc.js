var curve = require("./lib/elliptic-curve"),
    point = require("./lib/elliptic-point"),
    diffieHellman = require("./lib/elliptic-diffie-hellman"),
    elgamel =  require("./lib/elliptic-elgamel");

exports.curve = curve;
exports.point = point;
exports.diffieHellman = diffieHellman;
exports.elgamel = elgamel;
