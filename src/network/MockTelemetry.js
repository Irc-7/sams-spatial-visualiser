/**
 * SAMS Spatial Agentic Visualiser - Mock Telemetry Emitter
 * Generates realistic autonomous agent event streams for offline demos and local testing.
 */

export class MockTelemetry {
  /**
   * @param {Function} onEventCallback - Callback receiving parsed telemetry JSON
   * @param {Object} [options]
   */
  constructor(onEventCallback, options = {}) {
    this.onEvent = onEventCallback;
    this.intervalMs = options.intervalMs || 3200; // Emit every ~3.2s
    this.timer = null;
    this.isRunning = false;

    this.agentPool = [
      'agent_coder_01',
      'agent_researcher_02',
      'agent_reviewer_03',
      'agent_sre_04'
    ];

    this.zones = [
      'compute_pod_a',
      'compute_pod_b',
      'vault_enclave',
      'strategy_wall',
      'biophilic_lounge',
      'perimeter_gates'
    ];

    this.states = ['active', 'researching', 'idle', 'success', 'error', 'offline'];

    this.sampleTasks = {
      active: [
        'Compiling Rust WebAssembly microservice',
        'Refactoring AST parser for LLM streaming',
        'Executing distributed test suites across nodes',
        'Optimizing SQL execution plan and b-tree indexes',
        'Generating OpenAPI documentation contracts'
      ],
      researching: [
        'Retrieving embeddings from Pinecone vector corpus',
        'Crawling technical whitepapers on semantic routing',
        'Synthesizing arXiv multi-agent consensus papers',
        'Benchmarking kv-cache quantizations'
      ],
      idle: [
        'Standing by in operational standby buffer',
        'Heartbeat ping nominal - awaiting dispatch',
        'Awaiting upstream PR webhook triggers',
        'Idling in central corridor'
      ],
      success: [
        'Deployment to production cluster completed (zero downtime)',
        'Synthesized 42 unit test cases with 100% coverage',
        'Resolved critical race condition in websocket hub',
        'Sprint backlog telemetry fully reconciled'
      ],
      error: [
        'Rate limit 429 quota exhausted on Model Garden API',
        'Deadlock detected in shared distributed lock',
        'Schema validation failure on payload #8839',
        'Network socket timeout after 15000ms'
      ],
      offline: [
        'Agent node powering down for maintenance cycle',
        'Disconnected from ingress control plane',
        'Session drained and checkpoint written'
      ]
    };
  }

  /**
   * Starts generating simulated telemetry pulses.
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Fire initial baseline events for each agent
    this.agentPool.forEach((agentId, idx) => {
      setTimeout(() => {
        if (!this.isRunning) return;
        this.emitRandomEvent(agentId);
      }, idx * 600);
    });

    this.timer = setInterval(() => {
      const randomAgent = this.agentPool[Math.floor(Math.random() * this.agentPool.length)];
      this.emitRandomEvent(randomAgent);
    }, this.intervalMs);
  }

  /**
   * Stops simulation loop.
   */
  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Emits a randomized standardized event for a specific agent.
   * @param {string} agentId
   */
  emitRandomEvent(agentId) {
    const state = this.pickWeightedState();
    const zone = this.zones[Math.floor(Math.random() * this.zones.length)];
    const tasks = this.sampleTasks[state] || this.sampleTasks.active;
    const task = tasks[Math.floor(Math.random() * tasks.length)];

    const payload = {
      timestamp: Date.now(),
      agent_id: agentId,
      state: state,
      target_zone: zone,
      task_summary: task
    };

    if (this.onEvent) {
      this.onEvent(payload);
    }
  }

  /**
   * Generates a single explicit payload on manual demand.
   * @param {string} agentId
   * @param {string} state
   * @param {string} zone
   * @param {string} task
   */
  triggerManual(agentId, state, zone, task) {
    const payload = {
      timestamp: Date.now(),
      agent_id: agentId,
      state: state,
      target_zone: zone,
      task_summary: task || `Manual trigger executed: ${state}`
    };

    if (this.onEvent) {
      this.onEvent(payload);
    }
  }

  /**
   * Helper for realistic state distribution (more active/research/idle, fewer error/offline).
   * @returns {string}
   */
  pickWeightedState() {
    const r = Math.random();
    if (r < 0.35) return 'active';
    if (r < 0.60) return 'researching';
    if (r < 0.80) return 'idle';
    if (r < 0.90) return 'success';
    if (r < 0.96) return 'error';
    return 'offline';
  }
}
