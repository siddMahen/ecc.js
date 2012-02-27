var ecc = require("../");

var curve = ecc.curve(14, 19, 3623),
    s_pt  = ecc.point(6, 730);

var alice = ecc.elgamel(curve, s_pt, 12),
    alice_pub = alice.computePublicKey();

var bob = ecc.elgamel(curve, s_pt, 32),
    bob_pub = bob.computePublicKey(),
    message = ecc.point(2149, 196);

bob.encrypt(message, alice_pub, function(ciphertext){
    var plaintext = alice.decrypt(ciphertext);
    console.log(plaintext);
    console.log(message);
});

