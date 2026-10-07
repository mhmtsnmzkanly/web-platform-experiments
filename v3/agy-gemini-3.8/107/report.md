# Experiment Report: 107 — Multi-Context Frontier: Distributed Raft Consensus & MessagePort Cluster

## Frontier Classification: Multi-Context Frontier
This experiment establishes the **Multi-Context Frontier** within the Frontier Atlas. The mechanism fundamentally transcends a single synchronous window scope by distributing protocol actors across multiple isolated execution contexts:
1. **Multi-Thread Concurrency**: Node 0 executes on the Main Thread (Window Context), while Node 1 and Node 2 run as concurrent protocol actors inside a Dedicated Web Worker context.
2. **Channel-Based Coordination**: Inter-context communication is conducted strictly over independent asynchronous `MessageChannel` (`MessagePort`) links, exchanging serialized RPC packets (`APPEND_ENTRIES`, `APPEND_ENTRIES_REPLY`, heartbeats, and log entries).
3. **Causal Hello World Mechanism**: The cluster's replicated log is the sequential transaction sequence of "HELLO WORLD" ($T_1='H', \dots, T_{10}='D'$). A letter cannot be committed or rendered into the canonical output without obtaining verified majority quorum ($\ge 2/3$) across the thread boundary.

## Concept & Mechanics
1. **Governing Consensus Invariants**:
   - Quorum rule:
     $$Q = \left\lfloor \frac{N}{2} \right\rfloor + 1 = 2 \text{ nodes for } N=3$$
   - Monotonic commit invariant:
     $$\text{CommitIndex} = \max \{ i \mid \sum_{k=0}^2 \mathbf{1}_{\{\text{matchIndex}_k \ge i\}} \ge 2 \}$$
   - Partition isolation: When `#btnPartitionWorker` is toggled, message ports drop packets, simulating link severance. Quorum is lost ($1/3$), halting further commits until the partition heals and catch-up log replication occurs.

2. **Causal Typographic Role ("HELLO WORLD")**:
   - The 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') form the ordered transactions of the distributed database.
   - Leader proposes each character. Worker nodes validate against term monotonicity, store into their isolated in-worker memory array, and reply with their updated `matchIndex`.
   - Only when $\ge 2$ nodes match does the letter transition from `uncommitted` to `committed`, appearing on the canonical cluster terminal.

## Web Platform Surface
- **Multi-Context Pipeline**:
  - `new Worker(URL.createObjectURL(blob))` with isolated global scope.
  - Two explicit `MessageChannel` instances with `port1` retained on Main Thread and `port2` transferred to the Worker via `postMessage({ type: 'INIT_PORTS' }, [ch1.port2, ch2.port2])`.
- **Topological Canvas (`#topologyCanvas`)**:
  - $640 \times 360$ canvas displaying the execution context boundary, node circles with live commit indices, and animated in-flight packet particles traveling along links.
- **BBN ARPANET IMP Aesthetic**:
  - Deep slate/navy terminal (`#0d131f`), cyan/emerald status badges, monospace RPC log stream, and interactive partition testing.

## Verification Evidence
Verified via `tools.js verify 107/107.html 107`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid CSS).
- **Nominal Observables**: 2 execution contexts (Window + Dedicated Worker), 3 cluster nodes, active message passing (>40 RPC packets), leader and worker commit indices synchronized, verified quorum achieved ($\ge 2/3$).
- **Interaction Response**: Trusted CDP click on `#btnProposeNext` dispatched RPC transaction #5 ('O') across the MessagePort boundary. Nodes 1 and 2 acknowledged within 20ms, quorum was established, commit index advanced from 4 to 5 across all nodes, and the committed output updated to `H E L L O   _ _ _ _ _`.
