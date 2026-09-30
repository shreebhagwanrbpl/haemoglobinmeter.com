"use client";

import { WEBSITE_ID } from "./catalog-utils";

const pathOf = (parts) => parts.filter(Boolean).join("/");
export const db = { __catalogApi: true };
export function serverTimestamp() { return new Date().toISOString(); }
export function doc(_db, ...parts) { return { kind: "doc", path: pathOf(parts) }; }
export function collection(_db, ...parts) { return { kind: "collection", path: pathOf(parts) }; }

async function request(url, options) {
  try {
    const res = await fetch(url, {
      ...options,
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", ...(options?.headers || {}) },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.warn(`[firestore-shim] ${url} returned HTTP ${res.status}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.warn(`[firestore-shim] Network error requesting ${url}:`, err);
    return null;
  }
}

function unwrapDoc(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.data !== undefined) return payload.data;
  return payload;
}

function snap(raw, id = "") {
  const data = unwrapDoc(raw);
  const exists = data != null && (typeof data !== "object" || Object.keys(data).length > 0 || raw?.exists === true);
  return {
    exists: () => Boolean(data && exists),
    id,
    data: () => (typeof data === "object" && data !== null ? data : {}),
  };
}

export async function getDoc(ref) {
  const cleanPath = ref.path.startsWith("__website__")
    ? ref.path.replace(/^__website__/, `websites/${WEBSITE_ID}`)
    : ref.path;
  const data = await request(`/api/site-data?path=${encodeURIComponent(cleanPath)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`);
  return snap(data, ref.path.split("/").pop());
}

export async function getDocs(ref) {
  const cleanPath = ref.path.startsWith("__website__")
    ? ref.path.replace(/^__website__/, `websites/${WEBSITE_ID}`)
    : ref.path;
  const payload = await request(`/api/site-data?collection=${encodeURIComponent(cleanPath)}&websiteId=${encodeURIComponent(WEBSITE_ID)}`);
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.districts)
    ? payload.districts
    : Array.isArray(payload?.data)
    ? payload.data
    : [];
  const docs = rawList.map((r) => snap(r?.data !== undefined ? r.data : r, r?.id || r?.doc_id || r?.slug || ""));
  return {
    docs,
    forEach(cb) { docs.forEach(cb); },
    size: docs.length,
    empty: docs.length === 0,
  };
}

export async function addDoc(ref, data) {
  const parts = ref.path.split("/");
  const type = parts[0] === "websitesQueries" ? parts[2] : "";
  const endpoint = type === "productQueries" ? "/api/product-query" : "/api/contact-query";
  const result = await request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, websiteId: WEBSITE_ID }),
  });
  if (!result || result.ok === false) {
    throw new Error(result?.error || "Failed to submit query");
  }
  return { id: result?.id || result?.docId || `local-${Date.now()}` };
}


export function onSnapshot(ref, callback) {
  let stopped = false;
  const run = async () => {
    if (stopped) return;
    try {
      callback(await getDoc(ref));
    } catch (e) {
      console.error(e);
    }
  };
  run();
  const timer = setInterval(run, 3000);
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

