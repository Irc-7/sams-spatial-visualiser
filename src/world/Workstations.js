/**
 * SAMS Spatial Agentic Visualiser - Workstations & Zone Registry
 * Matching reference diorama 5 core interactive stations.
 */

export const WORKSTATION_ZONES = {
  VAULT: {
    id: 'vault',
    name: 'Vault',
    icon: 'shield',
    bounds: { minX: 0, maxX: 2.2, minY: 1.5, maxY: 4.0 },
    center: { x: 0.8, y: 2.5 },
    waypoints: [{ x: 1.6, y: 2.8, label: 'Vault Entry' }],
    color: '#334155',
    description: 'Heavy industrial reinforced steel safe storing encrypted keys and credentials.'
  },
  WHITEBOARD: {
    id: 'whiteboard',
    name: 'Whiteboard',
    icon: 'board',
    bounds: { minX: 3.0, maxX: 5.8, minY: 0, maxY: 2.0 },
    center: { x: 4.2, y: 0.5 },
    waypoints: [{ x: 4.2, y: 1.8, label: 'Architecture Board' }],
    color: '#0284c7',
    description: 'Mobile dry-erase whiteboard with system architecture and flowchart diagrams.'
  },
  KANBAN_WALL: {
    id: 'kanban_wall',
    name: 'Kanban Wall',
    icon: 'grid',
    bounds: { minX: 6.5, maxX: 9.5, minY: 0, maxY: 2.0 },
    center: { x: 7.8, y: 0.3 },
    waypoints: [{ x: 7.8, y: 1.6, label: 'Sprint Board' }],
    color: '#8b5cf6',
    description: 'Agile project management board with 4-column sprint tickets.'
  },
  DESK_01: {
    id: 'desk_01',
    name: 'Desk 01',
    icon: 'monitor',
    bounds: { minX: 3.2, maxX: 5.8, minY: 4.2, maxY: 7.2 },
    center: { x: 4.4, y: 5.6 },
    waypoints: [
      { x: 4.4, y: 6.2, label: 'Desk 01 Operator Chair' }
    ],
    color: '#2563eb',
    description: 'Executive wooden workstation with dual green-code monitors, operated by Lead Director.'
  },
  SECURITY_GATE: {
    id: 'security_gate',
    name: 'Security Gate',
    icon: 'lock',
    bounds: { minX: 7.5, maxX: 9.8, minY: 4.0, maxY: 7.0 },
    center: { x: 8.6, y: 5.2 },
    waypoints: [{ x: 8.0, y: 5.2, label: 'Access Control Turnstile' }],
    color: '#10b981',
    description: 'Automated biometric and RFID turnstile entrance portal.'
  },
  LOUNGE: {
    id: 'lounge',
    name: 'Lounge Area',
    icon: 'coffee',
    bounds: { minX: 0.2, maxX: 2.2, minY: 6.0, maxY: 9.2 },
    center: { x: 1.0, y: 6.8 },
    waypoints: [{ x: 1.0, y: 6.8, label: 'Armchair' }],
    color: '#ef4444',
    description: 'Relaxation lounge with modern cube armchair and ceramic coffee side table.'
  }
};

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

export function getWaypointForZone(zoneId) {
  const normalized = zoneId ? zoneId.toLowerCase() : '';
  for (const key in WORKSTATION_ZONES) {
    const zone = WORKSTATION_ZONES[key];
    if (zone.id === normalized || key.toLowerCase() === normalized) {
      return zone.waypoints[Math.floor(Math.random() * zone.waypoints.length)];
    }
  }
  return { x: 5, y: 5, label: 'Central Corridor' };
}
