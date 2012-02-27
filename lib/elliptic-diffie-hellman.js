/*
 * Creates a diffieHellman instance to compute
 * a shared key using a public elliptic curve
 * and a point on that curve.
 *
 * @class diffieHellman
 *
 * @param {Curve} curve
 * @param {Point} point
 * @param {Integer} key
 *
 * @returns {DiffieHellman} diffieHellman
 *
 * @api public
 */

function diffieHellman(curve, point, pri_key){
    if (!(this instanceof diffieHellman))
        return new diffieHellman(curve, point, pri_key);

    this.ec = curve;
    this.point = point;
    this.pri_key = pri_key;
}

/*
 * Computes the public key for the given private key
 *
 * @returns {Point} public key
 *
 * @api public
 */

diffieHellman.prototype.computePublicKey = function(){
    return this.ec.mod_mult(this.point, this.pri_key);
}

/*
 * Computes the shared secret given a public key
 *
 * @param {Point} pub_key
 *
 * @returns {Point} shared secret
 *
 * @api public
 */

diffieHellman.prototype.computeSharedSecret = function(pub_key){
    return this.ec.mod_mult(pub_key, this.pri_key);
}

// Try to do this w/ only the x
/*
diffieHellman.prototype.computeSmallPublicKey = function(){

}

diffieHellman.prototype.computeSmallSharedSecret = function(pub_key){

}
*/

// Exports
module.exports = diffieHellman;
