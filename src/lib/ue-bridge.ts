/**
 * Unreal Engine WebUI Bridge
 * 
 * Communication between React UI and Unreal Engine via WebUI plugin.
 * 
 * KEY INSIGHT from WebUI docs:
 * - The ue5 helper script captures `ue.interface` (the native C++ object) as a closure var,
 *   then replaces `window.ue.interface` with a NEW empty object.
 * - UE's "Call" Blueprint node invokes functions on the ORIGINAL native object (C++ reference).
 * - Therefore handlers must be attached to the ORIGINAL native object, not the replacement.
 * 
 * JS → UE: Use `window.ue5()` (helper auto-stringifies). Fallback to native broadcast.
 * UE → JS: Attach handlers to the original native interface object captured at init.
 */

declare global {
  interface Window {
    ue?: {
      interface: Record<string, unknown>;
    };
    ue5?: (eventName: string, data?: unknown) => void;
  }
}

export const isInUnrealEngine = (): boolean => {
  return typeof window.ue !== 'undefined' || typeof window.ue5 !== 'undefined';
};

let mockMode = !isInUnrealEngine();

const mockHandlers: Map<string, (data: unknown) => void> = new Map();
const registeredHandlers: Map<string, (data: unknown) => void> = new Map();

// ─── Capture the ORIGINAL native ue.interface before the ue5 helper replaces it ───
// The C++ "Call" node invokes functions on this original object.
// If our bridge loads AFTER the helper already ran, window.ue.interface is the replacement
// and we can't recover the original — so load order matters (bridge script first).
let originalNativeInterface: Record<string, unknown> | null = null;
let nativeBroadcast: ((name: string, data: string, callback?: string) => void) | null = null;

if (!mockMode && window.ue?.interface) {
  originalNativeInterface = window.ue.interface;
  const maybeBroadcast = window.ue.interface.broadcast;
  if (typeof maybeBroadcast === 'function') {
    nativeBroadcast = maybeBroadcast as (name: string, data: string, callback?: string) => void;
  }
}

// ─── Handler re-attachment poller ───
// The ue5 helper replaces window.ue.interface with a new object.
// We attach handlers to BOTH the original native object (for C++ Call) and the
// current window.ue.interface (for any JS-side calls).
let lastSeenWindowInterface: Record<string, unknown> | null = null;
let pollerStarted = false;

const attachHandlersTo = (target: Record<string, unknown>) => {
  registeredHandlers.forEach((handler, eventName) => {
    target[eventName] = handler;
  });
};

const ensureHandlersAttached = () => {
  if (mockMode) return;

  // Capture original native interface if we haven't yet
  // (covers case where ue object appears after our script loads)
  if (!originalNativeInterface && window.ue?.interface) {
    originalNativeInterface = window.ue.interface;
    if (!nativeBroadcast) {
      const maybeBroadcast = window.ue.interface.broadcast;
      if (typeof maybeBroadcast === 'function') {
        nativeBroadcast = maybeBroadcast as (name: string, data: string) => void;
      }
    }
    attachHandlersTo(originalNativeInterface);
  }

  // Always keep handlers on the original native interface (C++ calls go here)
  if (originalNativeInterface) {
    attachHandlersTo(originalNativeInterface);
  }

  // Also attach to current window.ue.interface if it's different (the helper replacement)
  const currentInterface = window.ue?.interface;
  if (currentInterface && currentInterface !== originalNativeInterface) {
    if (currentInterface !== lastSeenWindowInterface) {
      lastSeenWindowInterface = currentInterface;
    }
    attachHandlersTo(currentInterface);
  }
};

const startPoller = () => {
  if (pollerStarted || mockMode) return;
  pollerStarted = true;
  setInterval(ensureHandlersAttached, 500);
};

// ─── Event logging ───
interface EventLog {
  timestamp: Date;
  direction: 'to-ue' | 'from-ue';
  event: string;
  data: unknown;
}
const eventLog: EventLog[] = [];
const MAX_LOG_SIZE = 100;

const logEvent = (direction: 'to-ue' | 'from-ue', event: string, data: unknown) => {
  eventLog.push({ timestamp: new Date(), direction, event, data });
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog.shift();
  }
  if (mockMode) {
    console.log(`[UE Bridge ${direction}] ${event}:`, data);
  }
};

/**
 * Send an event to Unreal Engine.
 * Prefers ue5() (auto-stringifies). Falls back to native broadcast.
 */
export const sendToUnreal = (eventName: string, data?: unknown): void => {
  logEvent('to-ue', eventName, data);
  
  if (mockMode) {
    console.log(`[Mock UE] Would send to Unreal: ${eventName}`, data);
    simulateMockResponse(eventName, data);
    return;
  }

  const payload = data ?? {};

  try {
    // Prefer ue5() — recommended by WebUI docs, handles stringification internally
    if (typeof window.ue5 === 'function') {
      console.log(`[UE Bridge] ue5(${eventName})`, payload);
      window.ue5(eventName, payload);
      return;
    }

    // Fallback: use the native broadcast we captured at init (before helper wrapped it)
    if (nativeBroadcast) {
      const jsonStr = JSON.stringify(payload);
      console.log(`[UE Bridge] nativeBroadcast(${eventName})`, jsonStr);
      nativeBroadcast(eventName, jsonStr);
      return;
    }

    // Last resort: try whatever broadcast is currently on ue.interface
    const currentBroadcast = window.ue?.interface?.broadcast;
    if (typeof currentBroadcast === 'function') {
      // If ue5 exists, the current broadcast is the wrapper (already stringifies)
      // If ue5 doesn't exist, it's the native (needs stringify)
      const jsonStr = JSON.stringify(payload);
      console.log(`[UE Bridge] fallback broadcast(${eventName})`, jsonStr);
      (currentBroadcast as (name: string, data: string) => void)(eventName, jsonStr);
    } else {
      console.warn(`[UE Bridge] No send method available for: ${eventName}`);
    }
  } catch (error) {
    console.error('[UE Bridge] Error sending to Unreal:', error);
  }
};

/**
 * Register a handler for events coming from Unreal Engine.
 * Handlers are attached to the original native ue.interface object so that
 * UE's "Call" Blueprint node can find them.
 */
export const registerHandler = (
  eventName: string, 
  callback: (data: unknown) => void
): (() => void) => {
  if (mockMode) {
    mockHandlers.set(eventName, (data: unknown) => {
      logEvent('from-ue', eventName, data);
      callback(data);
    });
    console.log(`[Mock UE] Registered handler: ${eventName}`);
    return () => mockHandlers.delete(eventName);
  }

  const wrappedHandler = (data: unknown) => {
    logEvent('from-ue', eventName, data);
    callback(data);
  };

  registeredHandlers.set(eventName, wrappedHandler);

  // Attach to original native interface (C++ Call target)
  if (originalNativeInterface) {
    originalNativeInterface[eventName] = wrappedHandler;
  }

  // Also attach to current window.ue.interface (may be the helper's replacement)
  if (window.ue?.interface && window.ue.interface !== originalNativeInterface) {
    window.ue.interface[eventName] = wrappedHandler;
  }

  // Ensure poller is running to keep handlers attached
  startPoller();

  return () => {
    if (registeredHandlers.get(eventName) === wrappedHandler) {
      registeredHandlers.delete(eventName);
    }
    // Clean up from both objects
    if (originalNativeInterface && originalNativeInterface[eventName] === wrappedHandler) {
      delete originalNativeInterface[eventName];
    }
    if (window.ue?.interface && window.ue.interface[eventName] === wrappedHandler) {
      delete window.ue.interface[eventName];
    }
  };
};

// ─── Mock responses ───
const simulateMockResponse = (eventName: string, data: unknown) => {
  setTimeout(() => {
    switch (eventName) {
      case 'requestPOIList': {
        const updatePOIList = mockHandlers.get('updatePOIList');
        if (updatePOIList) {
          updatePOIList({
            categories: [
              { id: 'dining', name: 'Dining', count: 5 },
              { id: 'shopping', name: 'Shopping', count: 8 },
              { id: 'entertainment', name: 'Entertainment', count: 3 },
            ]
          });
        }
        break;
      }
      case 'requestUnitList': {
        const updateUnitList = mockHandlers.get('updateUnitList');
        if (updateUnitList) {
          updateUnitList({
            units: [
              { id: 'unit-a1', name: 'Unit A1', floor: 1, bedrooms: 2, available: true },
              { id: 'unit-a2', name: 'Unit A2', floor: 1, bedrooms: 3, available: true },
              { id: 'unit-b1', name: 'Unit B1', floor: 2, bedrooms: 2, available: false },
            ]
          });
        }
        break;
      }
      case 'focusPOI':
      case 'focusUnit':
        console.log(`[Mock UE] Camera would focus on target`);
        setTimeout(() => {
          const cameraReady = mockHandlers.get('cameraReady');
          if (cameraReady) {
            cameraReady({ unitId: (data as { id?: string })?.id });
          }
        }, 800);
        break;
      case 'focusSection':
        console.log(`[Mock UE] Camera would focus on section:`, data);
        setTimeout(() => {
          const sectionChanged = mockHandlers.get('sectionChanged');
          if (sectionChanged) {
            sectionChanged({ id: (data as { id?: string })?.id });
          }
        }, 500);
        break;
      case 'highlightUnit':
        console.log(`[Mock UE] Unit highlight toggled:`, data);
        break;
      case 'setTimeOfDay':
        console.log(`[Mock UE] Time of day set to:`, data);
        break;
      case 'setWeather':
        console.log(`[Mock UE] Weather set to:`, data);
        break;
      case 'setCameraView':
        console.log(`[Mock UE] Camera view set to:`, data);
        break;
      case 'resetCamera':
        console.log(`[Mock UE] Camera reset to default position`);
        break;
      case 'toggleAutoRotate':
        console.log(`[Mock UE] Auto-rotate toggled:`, data);
        break;
      case 'activateSurroundings':
        console.log(`[Mock UE] Surroundings view activated`);
        break;
      case 'deactivateSurroundings':
        console.log(`[Mock UE] Surroundings view deactivated`);
        break;
      case 'sendPOIData':
        console.log(`[Mock UE] Received POI data for procedural spawning:`, (data as { pois?: unknown[] })?.pois?.length ?? 0, 'POIs');
        break;
      case 'filterPOIs':
        console.log(`[Mock UE] Filter POIs by categories:`, data);
        break;
      case 'clearPOIs':
        console.log(`[Mock UE] All POI markers cleared`);
        break;
      case 'enterInterior':
        console.log(`[Mock UE] Loading interior for unit:`, data);
        setTimeout(() => {
          const interiorReady = mockHandlers.get('interiorReady');
          if (interiorReady) {
            interiorReady({ unitId: (data as { id?: string })?.id });
          }
        }, 2500);
        break;
      case 'exitInterior':
        console.log(`[Mock UE] Exiting interior mode`);
        break;
      case 'setObjectMaterial':
        console.log(`[Mock UE] Object material set:`, data);
        setTimeout(() => {
          const materialChanged = mockHandlers.get('materialChanged');
          if (materialChanged) {
            materialChanged(data);
          }
        }, 200);
        break;
      case 'setObjectVariant':
        console.log(`[Mock UE] Object variant set:`, data);
        break;
      case 'moveObject':
        console.log(`[Mock UE] Entering move mode`);
        setTimeout(() => {
          const objectMoved = mockHandlers.get('objectMoved');
          if (objectMoved) {
            objectMoved({ actor: 'MockActor', x: 100, y: 200, z: 0, yaw: 0 });
          }
        }, 2000);
        break;
      case 'rotateObject':
        console.log(`[Mock UE] Rotating object 90°:`, data);
        break;
      case 'cancelInteraction':
        console.log(`[Mock UE] Interaction cancelled`);
        break;
    }
  }, 300);
};

let mockObjectCounter = 0;

export const simulateMockObjectSelected = (x: number, y: number): void => {
  const handler = mockHandlers.get('objectSelected');
  if (!handler) return;

  mockObjectCounter++;
  const isVariant = mockObjectCounter % 3 === 0;
  const isMultiSlot = mockObjectCounter % 3 === 1;

  if (isVariant) {
    handler({
      actor: 'SM_Sofa_Modern',
      materials: [{ slot: 0, name: 'M_Sofa_Fabric' }],
      position: { x, y },
      currentVariant: 'leather-brown',
      variants: [
        { id: 'leather-brown', label: 'Brown Leather' },
        { id: 'leather-black', label: 'Black Leather' },
        { id: 'fabric-grey', label: 'Grey Fabric' },
        { id: 'fabric-blue', label: 'Blue Velvet' },
      ],
    });
  } else if (isMultiSlot) {
    handler({
      actor: 'SM_Cabinet_Kitchen',
      materials: [
        { slot: 0, name: 'M_Cabinet_Body' },
        { slot: 1, name: 'M_Cabinet_Handle' },
        { slot: 2, name: 'M_Cabinet_Countertop' },
      ],
      position: { x, y },
    });
  } else {
    handler({
      actor: 'SM_Wall_Panel',
      materials: [{ slot: 0, name: 'M_Wall_Paint' }],
      position: { x, y },
    });
  }
};

export const getEventLog = (): EventLog[] => [...eventLog];

export const setMockMode = (enabled: boolean): void => {
  mockMode = enabled;
  if (!enabled) {
    ensureHandlersAttached();
    startPoller();
  }
  console.log(`[UE Bridge] Mock mode: ${enabled ? 'enabled' : 'disabled'}`);
};

export const isMockMode = (): boolean => mockMode;

// Pre-defined event types
export const UEEvents = {
  // Events TO Unreal Engine
  FOCUS_POI: 'focusPOI',
  FOCUS_UNIT: 'focusUnit',
  FOCUS_SECTION: 'focusSection',
  HIGHLIGHT_UNIT: 'highlightUnit',
  REQUEST_POI_LIST: 'requestPOIList',
  REQUEST_UNIT_LIST: 'requestUnitList',
  SET_MATERIAL: 'setMaterial',
  NAVIGATE_CATEGORY: 'navigateCategory',
  TOGGLE_UI: 'toggleUI',
  
  ENTER_INTERIOR: 'enterInterior',
  EXIT_INTERIOR: 'exitInterior',
  INTERIOR_READY: 'interiorReady',

  EDIT_INTERIOR: 'editInterior',
  SET_OBJECT_MATERIAL: 'setObjectMaterial',
  SET_OBJECT_VARIANT: 'setObjectVariant',
  MOVE_OBJECT: 'moveObject',
  ROTATE_OBJECT: 'rotateObject',
  CANCEL_INTERACTION: 'cancelInteraction',
  OBJECT_SELECTED: 'objectSelected',
  OBJECT_DESELECTED: 'objectDeselected',
  OBJECT_MOVED: 'objectMoved',
  MATERIAL_CHANGED: 'materialChanged',

  ACTIVATE_SURROUNDINGS: 'activateSurroundings',
  DEACTIVATE_SURROUNDINGS: 'deactivateSurroundings',
  ACTIVATE_UNITS: 'activateUnits',
  DEACTIVATE_UNITS: 'deactivateUnits',
  ACTIVATE_PARKING: 'activateParking',
  DEACTIVATE_PARKING: 'deactivateParking',
  SELECT_PARKING_TYPE: 'selectParkingType',
  FOCUS_PARKING: 'focusParking',
  ACTIVATE_LOKALE: 'activateLokale',
  DEACTIVATE_LOKALE: 'deactivateLokale',
  ACTIVATE_HOME: 'activateHome',
  DEACTIVATE_HOME: 'deactivateHome',
  ACTIVATE_BUILDING_INFO: 'activateBuildingInfo',
  DEACTIVATE_BUILDING_INFO: 'deactivateBuildingInfo',

  SEND_POI_DATA: 'sendPOIData',
  FILTER_POIS: 'filterPOIs',
  CLEAR_POIS: 'clearPOIs',
  
  SET_TIME_OF_DAY: 'setTimeOfDay',
  SET_WEATHER: 'setWeather',
  SET_CAMERA_VIEW: 'setCameraView',
  RESET_CAMERA: 'resetCamera',
  TOGGLE_AUTO_ROTATE: 'toggleAutoRotate',
  
  // Events FROM Unreal Engine
  UPDATE_POI_LIST: 'updatePOIList',
  UPDATE_UNIT_LIST: 'updateUnitList',
  POI_SELECTED: 'poiSelected',
  UNIT_SELECTED: 'unitSelected',
  UNIT_HOVERED: 'unitHovered',
  SECTION_CHANGED: 'sectionChanged',
  CAMERA_MOVED: 'cameraMoved',
  CAMERA_READY: 'cameraReady',
  TIME_CHANGED: 'timeChanged',
  WEATHER_CHANGED: 'weatherChanged',
} as const;
