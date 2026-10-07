# Experiment 107 Journal: Multi-Context Frontier

## Frontier Assessment: Multi-Context Frontier
The Multi-Context Frontier requires meaningful communication, coordination, or distribution between multiple independent execution contexts outside a single synchronous window scope. Crucially, the instructions mandate:
"Do not reduce this to: opening a Worker just to calculate math. The coordination between contexts must be an integral part of the Hello World mechanism."

## Candidate Formulations

### Candidate A: Distributed Typographic Consensus (Raft/Paxos Protocol across Dedicated Worker & Main Thread via MessageChannel)
- **Concept**: A 3-node distributed cluster where Node 0 resides on the Main Thread and Nodes 1 & 2 reside inside an isolated Dedicated Web Worker (`new Worker(blob)`). Communication occurs via asynchronous `MessageChannel` (`MessagePort`) message passing. The cluster runs an authentic distributed consensus protocol (term clock, randomized election timeouts, `RequestVote` RPCs, and `AppendEntries` heartbeats/replication).
- **Causal Hello World Integration**: The distributed replicated log to be committed consists of the 10 sequential character transactions of "HELLO WORLD" ($T_1='H', T_2='E', \dots, T_{10}='D'$). A character cannot be committed or rendered into the canonical state machine without achieving a verified quorum ($\ge 2/3$ nodes) across the multi-context thread boundary. Simulating network latency or thread partition stalls commits; resolving the partition triggers catch-up replication across contexts.
- **Evidence Strategy**: Message round-trip count, log commit indices on both sides of the context boundary, term number, quorum confirmation, and verified match of committed log with "HELLO WORLD".

### Candidate B: Dual-Sandboxed Iframe Cryptographic Enclave Pipeline via `window.postMessage`
- **Concept**: An isolated sandboxed `<iframe>` acting as a secure hardware cryptographic co-processor that receives "HELLO WORLD" glyph tokens, performs asymmetric key exchange via `window.postMessage`, and renders verified ciphertexts.
- **Trade-off**: High DOM overhead with iframe injection; less clear distributed state synchronization than Raft consensus.

### Candidate C: Multi-Context BroadcastChannel Peer Mesh
- **Concept**: Using `new BroadcastChannel('hw_atlas_107')` to coordinate simulated tabs with Lamport logical clocks.
- **Trade-off**: BroadcastChannel is broadcast-only without point-to-point backpressure or isolated actor concurrency compared to Web Worker + MessageChannel.

## Selection
**Candidate A** is chosen. It perfectly fulfills the frontier requirement:
1. True multi-context distribution: Main Thread and Dedicated Web Worker running concurrent protocol event loops.
2. Real message-passing coordination: Point-to-point asynchronous `MessagePort` channels carrying `RequestVote` and `AppendEntries` RPC packets.
3. Causal Hello World mechanism: The 10 characters of "HELLO WORLD" are the distributed log entries. Consensus across contexts is strictly required for each letter to be committed and displayed.

## Mathematical & Protocol Model
- **Quorum Condition**:
  $$Q = \left\lfloor \frac{N}{2} \right\rfloor + 1 = \left\lfloor \frac{3}{2} \right\rfloor + 1 = 2 \text{ nodes}$$
- **State Machine Replication**:
  $$\text{Commit}(i) \iff \sum_{k=1}^3 \mathbf{1}_{\{\text{matchIndex}_k \ge i\}} \ge Q$$
- **Lamport / Raft Monotonic Term Clock**:
  $$t_{\text{current}} = \max(t_{\text{local}}, t_{\text{incoming}})$$

## Visual Direction
1974 Bolt Beranek and Newman (BBN) ARPANET Interface Message Processor (IMP) console.
- Muted cold-war terminal chassis: deep slate (`#0d131f`) with amber/cyan CRT oscilloscopes and illuminated node status matrices.
- Dynamic network topology graph showing Node 0 (Main Thread, `#38bdf8`), Node 1 (Worker Thread, `#34d399`), Node 2 (Worker Thread, `#f59e0b`), with animated message packets traveling along transmission links.
- Distributed Replicated Log tape showing uncommitted vs committed entries of "HELLO WORLD".
