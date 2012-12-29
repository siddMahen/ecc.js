var point = require("./elliptic-point"),
    pow = Math.pow,
    floor = Math.floor;

/*
 * Creates an elliptic curve of the form
 *
 * Y^2 = X^3 + AX + B
 *
 * over the field Fp.
 *
 * @class curve
 *
 * @param {Integer} A
 * @param {Integer} B
 * @param {Integer} Fp
 *
 * @returns {Curve} curve instance
 *
 * Although it is not explicitly checked, it should be
 * noted that operations work best over curves which are
 * non-singular, ergo the discriminant of the curve,
 * ∆ = 4A^3+27B^2, should be non-zero.
 *
 * Also note that for proper security, Fp should be
 * a relatively large number and preferably prime,
 * as to avoid any problems with Lenstra factorization.
 *
 * @api public
 */

function curve(A, B, Fp){
    if (!(this instanceof curve))
        return new curve(A, B, Fp);

    this.A  = A;
    this.B  = B;
    this.Fp = Fp;
}

/*
 * Computes wether a given point in on the
 * curve
 *
 * @param {Point} p
 *
 * @returns {Boolean} if p is or isn't on the curve
 *
 * @api public
 */

curve.prototype.contains = function(p){
    return this.mod((p.y*p.y), this.Fp) == this.mod(((p.x*p.x*p.x) + this.A*p.x + this.B), this.Fp);
}

/*
 * Computes modulo for both positive and
 * negative numbers.
 *
 * @param {Integer} a
 * @param {Integer} b
 *
 * @returns {Integer} a mod b
 *
 * @api public
 */

curve.prototype.mod = function(a, b){
    return (((a % b) + b) % b);
}

/*
 * Computes the GCD of two numbers
 *
 * gcd(a, b)
 *
 * @param {Integer} a
 * @param {Integer} b
 *
 * @returns {Integer} gcd(a, b)
 *
 * @api public
 */

curve.prototype.gcd = function(a, b){
    while(b != 0){
        var t = b;
        b = this.mod(a, b);
        a = t;
    }
    return a;
}

/*
 * Computes the solutions to the equation
 *
 * ax - by = gcd(a, b) = 1
 *
 * where a and b are given.
 *
 * @param {Integer} a
 * @param {Integer} b
 *
 * @returns {Integer[]} [x, -y]
 *
 * @api public
 */

curve.prototype.ext_gcd = function(a, b){
    var lx = 0, ly = 1,
        x  = 1, y  = 0;

    while(b !== 0){
        var r = this.mod(a, b),
            q = (a - r) / b,
            tmpx = x,
            tmpy = y;

        x = lx - (q*x);
        lx = tmpx;

        y = ly - (q*y);
        ly = tmpy;

        a = b;
        b = r;
    }

    return [ly, lx];
}

/*
 * Computes the solution to equations
 * of the form
 *
 * a/b = x (mod p)
 *
 * where a, b are given and p = Fp.
 *
 * @param {Integer} a
 * @param {Integer} b
 *
 * @returns {Integer} x
 *
 * @public
 */

curve.prototype.mod_inv = function(a, b){
    var res = this.ext_gcd(b, this.Fp),
        dis = res[1],
        x   = (a - (this.Fp*dis*a)) / b;

    return this.mod(x, this.Fp);
}

/*
 * Subtracts two points on the curve.
 *
 * See mod_add below for a description of the
 * algorithm.
 *
 * @param {Point} a
 * @param {Point} b
 *
 * @returns {Point} a - b
 *
 * @api public
 */

curve.prototype.mod_sub = function(a, b){
    return this.mod_add(a, point(b.x, -b.y));
}

/*
 * Adds two points on the curve.
 *
 * @param {Point} a
 * @param {Point} b
 *
 * @returns {Point} a + b
 *
 * @api public
 */

curve.prototype.mod_add = function(a, b){
    if(b.inf) return a;
    if(a.inf) return b;

    var x1 = a.x,
        x2 = b.x,
        y1 = a.y,
        y2 = b.y;

    if((x1 == x2) && (y1 == -y2))
        return point(Infinity, Infinity);

    if((x1 == x2) && (y1 == y2)){
        var lambda = this.mod_inv((3*(pow(x1, 2))) + this.A, 2*y1)
    } else {
        var lambda = this.mod_inv((y2 - y1), (x2 - x1));
    }

    var x3 = this.mod(((pow(lambda, 2)) - x1 - x2), this.Fp);
    var y3 = this.mod(((lambda*(x1 - x3)) - y1), this.Fp);

    return point(x3, y3);
}

/*
 * Adds a point on the curve, P,
 * to itself n times.
 *
 * This has been implemented using the Double-and-Add
 * algorithm.
 *
 * @param {Point} p
 * @param {Integer} n
 *
 * @returns {Point} q = np
 *
 * @api public
 */

curve.prototype.mod_mult = function(p, n){
    var q = p,
        r = point(Infinity, Infinity);

    while(n > 0){
        if(n % 2 == 1)
            r = this.mod_add(r, q);

        q = this.mod_add(q, q);
        n = floor(n / 2);
    }

    return r;
}

// Exports
module.exports = curve;
