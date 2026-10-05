# Experiment 097 — Cache Vault

Cache API stores the greeting in a local named cache. The vault opens only when a cached Response can be retrieved.

Mechanism Signature: greeting -> `Cache.put()` Response -> `Cache.match()` -> vault door state.
