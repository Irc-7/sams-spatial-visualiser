/**
 * SAMS Spatial Agentic Visualiser - Event Bridge
 * Ingests real-time events via WebSocket or Server-Sent Events (SSE).
 * Automatically handles reconnection and transparently falls back to MockTelemetry.
 */

import { MockTelemetry } from './MockTelemetry.js';

export class EventBridge {
  /**
   * @param {Object} [options]
   * @param {string} [options.url] - WebSocket or SSE endpoint URL
   * @param {string} [options.transport='auto'] - 'websocket' | 'sse' | 'mock' | 'auto'
   * @param {boolean} [options.enableMockFallback=true]
   */
  constructor(options = {}) {
    this.url = options.url || null;
    this.transport = options.transport || 'auto';
    this.enableMockFallback = options.enableMockFallback !== false;

    this.socket = null;
    this.eventSource = null;
    this.mockTelemetry = null;

    this.connectionState = 'disconnected'; // 'connected' | 'connecting' | 'fallback_mock' | 'disconnected'
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 15000;
    this.reconnectTimer = null;

    // Listeners map: eventName -> Set of callback functions
    this.listeners = new Map();

    this.init();
  }

  /**
   * Subscribes a callback to an event type ('agent_event', 'connection_change', 'telemetry_pulse').
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribes a callback.
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Dispatches an event to all registered listeners.
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        try {
          cb(data);
        } catch (err) {
          console.error(`[EventBridge] Listener error for "${event}":`, err);
        }
      }
    }
  }

  /**
   * Initializes network connector or activates fallback.
   */
  init() {
    if (this.url && this.transport !== 'mock') {
      if (this.url.startsWith('ws://') || this.url.startsWith('wss://') || this.transport === 'websocket') {
        this.connectWebSocket(this.url);
      } else {
        this.connectSSE(this.url);
      }
    } else {
      this.activateMockFallback('No external WebSocket/SSE URL provided - Running in autonomous demo mode.');
    }
  }

  /**
   * Connects to a WebSocket endpoint.
   * @param {string} wsUrl
   */
  connectWebSocket(wsUrl) {
    this.setConnectionState('connecting');
    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.setConnectionState('connected');
        console.log(`[EventBridge] WebSocket connected to ${wsUrl}`);
        if (this.mockTelemetry) {
          this.mockTelemetry.stop();
        }
      };

      this.socket.onmessage = (event) => {
        this.handleRawMessage(event.data);
      };

      this.socket.onerror = (error) => {
        console.warn('[EventBridge] WebSocket error encountered:', error);
      };

      this.socket.onclose = () => {
        console.warn('[EventBridge] WebSocket closed.');
        this.socket = null;
        this.handleDisconnect();
      };
    } catch (err) {
      console.error('[EventBridge] WebSocket instantiation failed:', err);
      this.handleDisconnect();
    }
  }

  /**
   * Connects to an SSE endpoint.
   * @param {string} sseUrl
   */
  connectSSE(sseUrl) {
    this.setConnectionState('connecting');
    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        this.setConnectionState('connected');
        console.log(`[EventBridge] SSE connected to ${sseUrl}`);
        if (this.mockTelemetry) {
          this.mockTelemetry.stop();
        }
      };

      this.eventSource.onmessage = (event) => {
        this.handleRawMessage(event.data);
      };

      this.eventSource.onerror = (error) => {
        console.warn('[EventBridge] SSE connection dropped:', error);
        this.eventSource.close();
        this.eventSource = null;
        this.handleDisconnect();
      };
    } catch (err) {
      console.error('[EventBridge] SSE instantiation failed:', err);
      this.handleDisconnect();
    }
  }

  /**
   * Parses and validates incoming telemetry event JSON payload.
   * @param {string} rawData
   */
  handleRawMessage(rawData) {
    try {
      const payload = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      // Standardize schema
      const normalized = {
        timestamp: payload.timestamp || Date.now(),
        agent_id: payload.agent_id || payload.agentId || 'unknown_agent',
        state: payload.state || 'idle',
        target_zone: payload.target_zone || payload.targetZone || 'corridor',
        task_summary: payload.task_summary || payload.taskSummary || payload.task || 'Operating'
      };

      this.emit('agent_event', normalized);
      this.emit('telemetry_pulse', normalized);
    } catch (e) {
      console.warn('[EventBridge] Malformed payload received:', rawData, e);
    }
  }

  /**
   * Handles unexpected network disconnection and schedule fallback or reconnect.
   */
  handleDisconnect() {
    this.setConnectionState('disconnected');

    if (this.enableMockFallback && !this.mockTelemetry) {
      this.activateMockFallback('Network offline - seamlessly fallen back to internal MockTelemetry.');
    }

    // Attempt exponential backoff reconnect if URL was provided
    if (this.url) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelay);
      console.log(`[EventBridge] Will attempt reconnect in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts})`);
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(() => {
        if (this.connectionState !== 'connected') {
          this.init();
        }
      }, delay);
    }
  }

  /**
   * Activates the built-in MockTelemetry generator.
   * @param {string} [reason]
   */
  activateMockFallback(reason = '') {
    if (this.mockTelemetry && this.mockTelemetry.isRunning) return;

    this.setConnectionState('fallback_mock');
    console.info(`[EventBridge] ${reason}`);

    if (!this.mockTelemetry) {
      this.mockTelemetry = new MockTelemetry((payload) => {
        this.emit('agent_event', payload);
        this.emit('telemetry_pulse', payload);
      });
    }

    this.mockTelemetry.start();
  }

  /**
   * Updates state and notifies subscribers.
   * @param {string} newState
   */
  setConnectionState(newState) {
    this.connectionState = newState;
    this.emit('connection_change', {
      state: newState,
      url: this.url,
      isMock: newState === 'fallback_mock'
    });
  }

  /**
   * Triggers a manual event via either active mock or direct emit.
   * @param {string} agentId
   * @param {string} state
   * @param {string} zone
   * @param {string} task
   */
  sendManualEvent(agentId, state, zone, task) {
    const payload = {
      timestamp: Date.now(),
      agent_id: agentId,
      state: state,
      target_zone: zone,
      task_summary: task
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }

    // Immediately dispatch locally as well
    this.emit('agent_event', payload);
    this.emit('telemetry_pulse', payload);
  }
}
