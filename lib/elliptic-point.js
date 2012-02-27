/*
 * Creates a point x, y, where
 * x and y can be Infinity.
 *
 * @class point
 *
 * @param {Integer} x
 * @param {Integer} y
 *
 * @returns {Point} (x, y)
 *
 * @api public
 */

function point(x, y){
    if(!(this instanceof point))
        return new point(x, y);

    if(x == Infinity && y == Infinity)
        this.inf = true;
    else
        this.inf = false;

    this.x = x;
    this.y = y;
}

// Exports
module.exports = point;
