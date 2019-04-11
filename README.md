# MFM_Challenge

# Setup #

I wrote this using visual studio 2015.
It is a node.js application.

I used:

- Node version 6.4.0
- npm 2.7.4

You will need the following modules in npm:

- blockcypher 0.2.0
- eccrypto 1.1.1
- ejs 2.6.1
- express 4.16.4
- secp256k1 3.6.2

# Running #
It is currently set to use blockcypher test.  (I always seem to get coins form the faucet for it.)
To change it to use bit coin go into bcypherapi.js and comment the block line for blockcypher and un-comment the bit coin line.  See the js for more information.

# Using it #
## Look up / New address ##
You can type in an address and hit look up to get the transactions.  If this run of the server had created the address it will know the public and private keys.

You can create a new address plus keys by hitting the new address button.

## Add a new transaction ##
The new transaction section will not show if the address has no coins.
For a new transaction:
1. Fill the address you want to send the coins to.
2. Fill the amount you want to send.
3. If needed fill the public and private keys for the address.  It might know these keys if this application had created during this run.
4. Hit the new transaction button.

## Errors ##
Any errors will appear at the top of the page.

## Test data ##
There are 2 default addresses for blockcypher test that the application knows of:

Address 1: CCynbmaZdeBgHo4FZQ3qLj47hZxhWiJTgH

Address 2: CA6DpSbohSE3JqM5fEfGuZk6tQsopi3Bxi

It will know the keys for both these addresss and they should have coins in them.