/**
 * SAMS Spatial Agentic Visualiser - Workstations & Zone Registry
 * Metadata, spatial bounds, waypoints, and interaction radii for workspace hubs.
 */

export const WORKSTATION_ZONES = {
  VAULT_ENCLAVE: {
    id: 'vault_enclave',
    name: 'Secure Enclave & Vault',
    type: 'security_infra',
    bounds: { minX: 0, maxX: 3, minY: 0, maxY: 3 },
    center: { x: 1.5, y: 1.5 },
    waypoints: [
      { x: 1.5, y: 1.5, label: 'Vault Mainframe' },
      { x: 2.5, y: 1.0, label: 'Cold Storage Terminal' }
    ],
    color: '#0284c7', // Sky Blue / Cyan
    theme: 'vault',
    description: 'High-security zero-trust compute core with air-gapped server racks.'
  },
  COMPUTE_POD_A: {
    id: 'compute_pod_a',
    name: 'Compute Island Pod Alpha',
    type: 'development_core',
    bounds: { minX: 2, maxX: 4, minY: 4, maxY: 6 },
    center: { x: 3.0, y: 5.0 },
    waypoints: [
      { x: 3.0, y: 4.5, label: 'Dual-Monitor Desk 01' },
      { x: 3.5, y: 5.5, label: 'Dual-Monitor Desk 02' }
    ],
    color: '#2563eb', // Indigo Blue
    theme: 'compute',
    description: 'High-density developer workstations with telemetry HUDs.'
  },
  COMPUTE_POD_B: {
    id: 'compute_pod_b',
    name: 'Compute Island Pod Beta',
    type: 'analytics_core',
    bounds: { minX: 4, maxX: 6, minY: 6, maxY: 8 },
    center: { x: 5.0, y: 7.0 },
    waypoints: [
      { x: 4.5, y: 6.5, label: 'Analytics Station' },
      { x: 5.5, y: 7.5, label: 'Model Evaluation Node' }
    ],
    color: '#7c3aed', // Purple
    theme: 'compute',
    description: 'Distributed inference nodes and real-time model evaluation pod.'
  },
  STRATEGY_WALL: {
    id: 'strategy_wall',
    name: 'Strategy Wall & Sprint Kanban',
    type: 'orchestration',
    bounds: { minX: 7, maxX: 11, minY: 0, maxY: 3 },
    center: { x: 9.0, y: 1.5 },
    waypoints: [
      { x: 8.5, y: 1.5, label: 'Sprint Kanban Board' },
      { x: 10.0, y: 1.5, label: 'Architecture Whiteboard' }
    ],
    color: '#f59e0b', // Amber
    theme: 'strategy',
    description: 'Autonomous agent task orchestration and multi-agent sprint board.'
  },
  BIOPHILIC_LOUNGE: {
    id: 'biophilic_lounge',
    name: 'Biophilic Breakout Lounge',
    type: 'relaxation_research',
    bounds: { minX: 1, maxX: 4, minY: 9, maxY: 11 },
    center: { x: 2.5, y: 10.0 },
    waypoints: [
      { x: 2.0, y: 10.0, label: 'Sectional Sofa Lounge' },
      { x: 3.2, y: 9.8, label: 'Coffee Station & Flora' }
    ],
    color: '#10b981', // Emerald
    theme: 'lounge',
    description: 'Acoustic calm sanctuary with Monstera planters and marble coffee desk.'
  },
  PERIMETER_GATES: {
    id: 'perimeter_gates',
    name: 'Speed-Gate Security Turnstiles',
    type: 'access_control',
    bounds: { minX: 9, maxX: 11, minY: 9, maxY: 11 },
    center: { x: 10.0, y: 10.0 },
    waypoints: [
      { x: 10.0, y: 10.0, label: 'Laser Turnstile Gate' }
    ],
    color: '#ef4444', // Red
    theme: 'turnstiles',
    description: 'Biometric ingress/egress speed gates with optical optical security.'
  }
};

/**
 * Returns zone info given grid coordinates X and Y.
 * @param {number} x
 * @param {number} y
 * @returns {Object|null}
 */
export function getZoneAtGrid(x, y) {
  for (const key in WORKSTATION_ZONES) {
    const zone = WORKSTATION_ZONES[key];
    const b = zone.bounds;
    if (x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY) {
      return zone;
    }
  }
  return null;
}

/**
 * Finds the closest waypoint for a specified target zone ID.
 * @param {string} zoneId
 * @returns {{x: number, y: number, label: string}|null}
 */
export function getWaypointForZone(zoneId) {
  const normalized = zoneId ? zoneId.toLowerCase() : '';
  for (const key in WORKSTATION_ZONES) {
    const zone = WORKSTATION_ZONES[key];
    if (zone.id === normalized || key.toLowerCase() === normalized) {
      return zone.waypoints[Math.floor(Math.random() * zone.waypoints.length)];
    }
  }
  // Default to center if not found
  return { x: 6, y: 6, label: 'Central Corridor' };
}
