# Experiment 077 — Twin Telegraph

MessageChannel creates two local ports like a telegraph line. Posting the greeting on one port updates the other station and animates a pulse across the wire.

Mechanism Signature: `MessageChannel.port2.postMessage()` -> `port1.message` -> receiver inscription and pulse.
