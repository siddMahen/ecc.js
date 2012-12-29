var crypto = require("crypto"),
    point = require("./elliptic-point");

/*
 * Creates an elliptic elgamel instance to
 * facilitate the encryption and decryption
 * of data.
 *
 * @class elgamel
 *
 * @param {Curve} curve
 * @param {Point} point
 * @param {Integer} key
 *
 * @returns {Elgamel} elgamel
 *
 * @api public
 */

function elgamel(curve, point, key){
    if(!(this instanceof elgamel))
        return new elgamel(curve, point, key);

    this.ec = curve;
    this.point = point;
    this.key = key;
}

/*
 * Computes the public key based on the private key.
 *
 * @returns {Point} public key
 *
 * @api public
 */

elgamel.prototype.computePublicKey = function(){
    return this.ec.mod_mult(this.point, this.key);
}

/*
 * Encrypts a point using a public key.
 *
 * The callback returns the ciphertext as it's
 * first parameter.
 *
 * @param {Point} plaintext
 * @param {Point} pub_key
 * @param {Function} callback
 *
 * @returns {Point} ciphertext
 *
 * @api public
 */

elgamel.prototype.encrypt = function(plaintext, pub_key, callback){
    var self = this,
        curve = self.ec;

    crypto.randomBytes(1024, function(err, buff){
        var str = buff.toString("utf8"),
            k = 0;

        for(var i = 0; i < str.length; i++){ k ^= str.charCodeAt(i) }

        var c1 = curve.mod_mult(self.point, k),
            c2 = curve.mod_add(plaintext, curve.mod_mult(pub_key, k));

        return callback(point(c1, c2));
    });
}

/*
 * Decrypts a point using the given private key.
 *
 * @param {Point} ciphertext
 *
 * @returns {Point} plaintext
 *
 * @api public
 */

elgamel.prototype.decrypt = function(ciphertext){
    var c1 = ciphertext.x,
        c2 = ciphertext.y,
        curve = this.ec;

    return curve.mod_sub(c2, curve.mod_mult(c1, this.key));
}

// Exports
module.exports = elgamel;
