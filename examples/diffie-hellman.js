var ecc = require("../");

var curve = ecc.curve(324, 1287, 3851),
    point = ecc.point(920, 303);

var alice = ecc.diffieHellman(curve, point, 1194),
    bob = ecc.diffieHellman(curve, point, 1759);

var alice_pub = alice.computePublicKey(),
    bob_pub = bob.computePublicKey();

var res1 = alice.computeSharedSecret(bob_pub),
    res2 = bob.computeSharedSecret(alice_pub);

// They're the same!
console.log(res1);
console.log(res2);
