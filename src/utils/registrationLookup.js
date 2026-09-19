/* ==========================================================================
   CELESTECON 2026 — registrationLookup.js
   Manages Registration UID lookup, prompt access filtering, and per-event
   submission quota tracking with completed status strike-out.
   ========================================================================== */

export const EVENT_ID_ALIASES = {
  theatre: 'surprise',
  surprise: 'surprise',
  dimension3: 'dimension3',
  cad: 'dimension3',
  bpp: 'bpp',
  business: 'bpp',
  volatus: 'volatus',
  cosmovate: 'cosmovate',
  dispute: 'dispute',
  debate: 'dispute',
  settle: 'settle',
  settlement: 'settle',
  quizzitch: 'quizzitch',
  quiz: 'quizzitch',
  gamejam: 'gamejam',
  f1: 'f1'
};

export const DEMO_REGISTRATION = {
  uid: 'CLT-2026-DEMO',
  submissionID: 'DEMO-98765',
  school: {
    name: 'Delhi Public School, R.K. Puram',
    contact: 'Aditya Mathur',
    email: 'celestecon@dpsrkp.net',
    phone: '+91 98100 12345'
  },
  events: [
    {
      id: 'dispute',
      name: 'In Pursuit of Dispute (Debate)',
      teams: [
        {
          teamName: 'Team Veritas',
          category: 'Senior (Classes 9-12)',
          members: [
            { name: 'Arjun Mehta', class: '11', gender: 'M' },
            { name: 'Sanya Kapoor', class: '12', gender: 'F' }
          ]
        }
      ]
    },
    {
      id: 'settle',
      name: 'Settle-me-this (Space Settlement)',
      teams: [
        {
          teamName: 'Habitat Sol Invictus',
          category: 'Senior (Classes 9-12)',
          members: [
            { name: 'Rohan Sharma', class: '11', gender: 'M' },
            { name: 'Ananya Sen', class: '10', gender: 'F' },
            { name: 'Kavya Nair', class: '11', gender: 'F' }
          ]
        },
        {
          teamName: 'Lunar Pioneer Alpha',
          category: 'Junior (Classes 6-8)',
          members: [
            { name: 'Vihaan Verma', class: '7', gender: 'M' },
            { name: 'Tanvi Iyer', class: '8', gender: 'F' },
            { name: 'Kabir Das', class: '8', gender: 'M' }
          ]
        }
      ]
    }
  ],
  totals: { totalEvents: 2, totalTeams: 3, totalParticipants: 8 },
  submittedAt: new Date().toISOString()
};

export function normalizeUid(uid) {
  if (!uid) return '';
  return String(uid).trim().toUpperCase();
}

export function normalizeEventId(id) {
  if (!id) return '';
  const clean = String(id).trim().toLowerCase();
  return EVENT_ID_ALIASES[clean] || clean;
}

export function getLocalRegistrations() {
  try {
    const raw = localStorage.getItem('c26_registrations');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveLocalRegistration(reg) {
  if (!reg || !reg.uid) return;
  try {
    const store = getLocalRegistrations();
    const key = normalizeUid(reg.uid);
    store[key] = reg;
    if (reg.submissionID) {
      store[normalizeUid(reg.submissionID)] = reg;
    }
    localStorage.setItem('c26_registrations', JSON.stringify(store));
  } catch (e) {
    console.warn('[registrationLookup] Failed to save local registration:', e);
  }
}

export function getActiveUID() {
  try {
    return localStorage.getItem('c26_active_uid') || '';
  } catch (e) {
    return '';
  }
}

export function setActiveUID(uid) {
  try {
    if (uid) {
      localStorage.setItem('c26_active_uid', normalizeUid(uid));
    } else {
      localStorage.removeItem('c26_active_uid');
    }
  } catch (e) {
    console.warn('[registrationLookup] Failed to set active UID:', e);
  }
}

// Bounded LRU cache to prevent memory growth under high volume
class BoundedLRUMap {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  set(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
  has(key) {
    return this.map.has(key);
  }
  delete(key) {
    return this.map.delete(key);
  }
}

const _memoryCache = new BoundedLRUMap(100);
const _negativeCache = new BoundedLRUMap(100); // key -> timestamp of 404
const _inFlightLookups = new Map(); // key -> Promise
const NEGATIVE_CACHE_TTL_MS = 30000; // 30 seconds

export async function lookupRegistration(uid, { forceRefresh = false } = {}) {
  const clean = normalizeUid(uid);
  if (!clean) return null;

  // 1. Check Demo UID
  if (clean === 'CLT-2026-DEMO' || clean === 'DEMO') {
    return DEMO_REGISTRATION;
  }

  // 2. Check In-Memory Cache (skip if forceRefresh is true)
  if (!forceRefresh && _memoryCache.has(clean)) {
    return _memoryCache.get(clean);
  }

  // 3. Check Negative Cache (prevent spamming API on recently failed lookups, skip if forceRefresh)
  if (!forceRefresh) {
    const lastFailed = _negativeCache.get(clean);
    if (lastFailed && Date.now() - lastFailed < NEGATIVE_CACHE_TTL_MS) {
      return null;
    }
  }

  // 4. Check LocalStorage (skip if forceRefresh is true)
  if (!forceRefresh) {
    const localStore = getLocalRegistrations();
    if (localStore[clean]) {
      _memoryCache.set(clean, localStore[clean]);
      return localStore[clean];
    }
    // Try looking for partial matches or digit matches (e.g. 98765 or CLT-2026-98765)
    const digits = clean.replace(/\D/g, '');
    for (const k of Object.keys(localStore)) {
      if (k.includes(clean) || (digits && digits.length >= 4 && k.includes(digits))) {
        _memoryCache.set(clean, localStore[k]);
        return localStore[k];
      }
    }
  }

  // 5. In-flight deduplication: reuse active request if already fetching this clean UID
  if (_inFlightLookups.has(clean)) {
    return _inFlightLookups.get(clean);
  }

  // 6. Try Remote Proxy API
  const fetchPromise = (async () => {
    try {
      const res = await fetch(`/api/registration/${encodeURIComponent(clean)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.uid || data.school)) {
          saveLocalRegistration(data);
          _memoryCache.set(clean, data);
          _negativeCache.delete(clean);
          return data;
        }
      } else if (res.status === 404) {
        _negativeCache.set(clean, Date.now());
      }
    } catch {
      // API not reachable or offline
    } finally {
      _inFlightLookups.delete(clean);
    }
    return null;
  })();

  _inFlightLookups.set(clean, fetchPromise);
  return fetchPromise;
}

export function getLocalSubmissions(uid) {
  const clean = normalizeUid(uid);
  if (!clean) return [];
  try {
    const raw = localStorage.getItem(`c26_submissions_${clean}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalSubmission(uid, submission) {
  const clean = normalizeUid(uid);
  if (!clean || !submission) return;
  try {
    const list = getLocalSubmissions(clean);
    list.push({
      ...submission,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(`c26_submissions_${clean}`, JSON.stringify(list));
  } catch (e) {
    console.warn('[registrationLookup] Failed to save local submission:', e);
  }
}

export function calculateEventAllocations(registration, submissions = []) {
  if (!registration || !registration.events) return [];

  return registration.events.map((ev) => {
    const normId = normalizeEventId(ev.id);
    const totalSlots = Math.max(1, (ev.teams && ev.teams.length) || 1);

    const matchingSubmissions = (submissions || []).filter((sub) => {
      const subEventId = normalizeEventId(sub.event?.id || sub.eventId);
      const subEventName = (sub.event?.name || sub.eventName || '').toLowerCase();
      const currentName = (ev.name || '').toLowerCase();
      return (
        subEventId === normId ||
        subEventId === ev.id ||
        (normId && subEventName.includes(normId)) ||
        (subEventId && currentName.includes(subEventId))
      );
    });

    const submittedCount = matchingSubmissions.length;
    const remainingSlots = Math.max(0, totalSlots - submittedCount);
    const isCompleted = remainingSlots <= 0;
    const nextSlotIndex = submittedCount + 1;

    return {
      id: ev.id,
      normId,
      name: ev.name,
      totalSlots,
      submittedCount,
      remainingSlots,
      isCompleted,
      nextSlotIndex,
      teams: ev.teams || [],
      matchingSubmissions
    };
  });
}

export function isEventRegistered(registration, promptId) {
  if (!registration || !registration.events) return false;
  const targetNorm = normalizeEventId(promptId);
  return registration.events.some((ev) => {
    const evNorm = normalizeEventId(ev.id);
    const evName = (ev.name || '').toLowerCase();
    return (
      evNorm === targetNorm ||
      ev.id === promptId ||
      evName.includes(targetNorm) ||
      targetNorm.includes(ev.id)
    );
  });
}
