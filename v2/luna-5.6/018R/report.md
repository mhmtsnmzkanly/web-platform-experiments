# Experiment 018R — Registration Press

## Revision intent

Keep `mix-blend-mode`, but model the greeting as two physical ink passes with adjustable registration.

## Visual and interaction design

The cyan and coral plates slide apart as the registration control moves. A stock button changes the paper identity, allowing the blend to be inspected against a second substrate.

## Technology

`mix-blend-mode: multiply`, layered typography, CSS custom properties, range input, and button-driven palette changes.

## Verification

```text
node tools.js verify 018R/018R.html 018R
```
