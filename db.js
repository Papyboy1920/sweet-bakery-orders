// ============================================================
// Sweet Bakery Cafeteria — capa de base de datos
// Dos backends: Postgres (si existe DATABASE_URL) o SQLite
// local (node:sqlite, sin dependencias nativas) como respaldo.
// Toda la app usa esta API async; server.js no toca SQL directo.
// ============================================================

const path = require("path");
const { SEED_CATALOG, CATALOG_VERSION } = require("./seed");

let kind = null;   // "pg" | "sqlite"
let pool = null;   // pg Pool
let sdb = null;    // node:sqlite DatabaseSync

const SQLITE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    items TEXT NOT NULL,
    customer TEXT NOT NULL,
    payment TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'nuevo',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
`;

const PG_SCHEMA = `
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    items TEXT NOT NULL,
    customer TEXT NOT NULL,
    payment TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'nuevo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );`;

// ---------- Fusión de catálogo (nunca destructiva) ----------
// Fusiona la semilla con el catálogo vivo SIN borrar ni sobrescribir
// lo que el dueño editó en /tienda:
// - Conserva intactos los departamentos/categorías/ítems agregados por el dueño.
// - Agrega los departamentos/categorías/ítems nuevos que trae la semilla.
// - Rellena solo campos vacíos (desc, img) desde la semilla.
// - Jamás toca name, price, unit, active ni ningún valor que ya exista.
function mergeCatalog(live, seed) {
  const base =
    live && Array.isArray(live.departments)
      ? JSON.parse(JSON.stringify(live))
      : { departments: [] };
  if (!Array.isArray(base.departments)) base.departments = [];
  let added = 0;
  let filled = 0;
  const byId = (arr, id) => (arr || []).find((x) => x && x.id === id);
  for (const sDept of (seed && seed.departments) || []) {
    let d = byId(base.departments, sDept.id);
    if (!d) {
      base.departments.push(JSON.parse(JSON.stringify(sDept)));
      added++;
      continue;
    }
    d.categories = d.categories || [];
    for (const sCat of sDept.categories || []) {
      let c = byId(d.categories, sCat.id);
      if (!c) {
        d.categories.push(JSON.parse(JSON.stringify(sCat)));
        added++;
        continue;
      }
      c.items = c.items || [];
      for (const sItem of sCat.items || []) {
        const it = byId(c.items, sItem.id);
        if (!it) {
          c.items.push(JSON.parse(JSON.stringify(sItem)));
          added++;
        } else {
          for (const f of ["desc", "img"]) {
            if ((it[f] === undefined || it[f] === null || it[f] === "") && sItem[f]) {
              it[f] = sItem[f];
              filled++;
            }
          }
        }
      }
    }
  }
  return { catalog: base, added, filled };
}

// ---------- Migraciones puntuales de fotos ----------
// Corrigen imágenes sin tocar lo del dueño: solo se aplican si el valor
// actual es EXACTAMENTE el viejo. Idempotentes.
// v2 (2026-09-28): reemplaza los 8 placeholders genéricos por departamento
// con 29 fotos únicas por plato (pedido de Portal).
const IMAGE_FIXES = {
  "cuban-sandwich":      { old: "dept-sandwiches.jpg", new: "cuban-sandwich.jpg" },
  "media-noche":          { old: "dept-sandwiches.jpg", new: "media-noche.jpg" },
  "pan-bistec":           { old: "dept-sandwiches.jpg", new: "pan-bistec.jpg" },
  "pan-lechon":           { old: "dept-sandwiches.jpg", new: "pan-lechon.jpg" },
  "pan-croqueta":         { old: "dept-sandwiches.jpg", new: "pan-croqueta.jpg" },
  "croq-6":               { old: "dept-croquetas.jpg",  new: "croq-6.jpg" },
  "croq-12":              { old: "dept-croquetas.jpg",  new: "croq-12.jpg" },
  "past-guayaba":         { old: "dept-pastelitos.jpg", new: "past-guayaba.jpg" },
  "past-queso":           { old: "dept-pastelitos.jpg", new: "past-queso.jpg" },
  "past-carne":           { old: "dept-pastelitos.jpg", new: "past-carne.jpg" },
  "past-guayaba-queso":   { old: "dept-pastelitos.jpg", new: "past-guayaba-queso.jpg" },
  "pizza-pastel":         { old: "dept-pastelitos.jpg", new: "pizza-pastel.jpg" },
  "emp-jamon-queso":      { old: "dept-pastelitos.jpg", new: "emp-jamon-queso.jpg" },
  "emp-pollo":            { old: "dept-pastelitos.jpg", new: "emp-pollo.jpg" },
  "emp-carne":            { old: "dept-pastelitos.jpg", new: "emp-carne.jpg" },
  "cafecito":             { old: "dept-cafe.jpg",       new: "cafecito.jpg" },
  "cortadito":            { old: "dept-cafe.jpg",       new: "cortadito.jpg" },
  "colada":               { old: "dept-cafe.jpg",       new: "colada.jpg" },
  "cafe-leche-s":         { old: "dept-cafe.jpg",       new: "cafe-leche-s.jpg" },
  "cafe-leche-l":         { old: "dept-cafe.jpg",       new: "cafe-leche-l.jpg" },
  "huevos-fritos":        { old: "dept-desayunos.jpg",  new: "huevos-fritos.jpg" },
  "huevos-revueltos":     { old: "dept-desayunos.jpg",  new: "huevos-revueltos.jpg" },
  "tortilla-espanola":    { old: "dept-desayunos.jpg",  new: "tortilla-espanola.jpg" },
  "tostadas":             { old: "dept-desayunos.jpg",  new: "tostadas.jpg" },
  "tortilla-gusto":       { old: "dept-desayunos.jpg",  new: "tortilla-gusto.jpg" },
  "batido-mango":         { old: "dept-batidos.jpg",    new: "batido-mango.jpg" },
  "batido-mamey":         { old: "dept-batidos.jpg",    new: "batido-mamey.jpg" },
  "batido-guayaba":       { old: "dept-batidos.jpg",    new: "batido-guayaba.jpg" },
  "guarapo":              { old: "dept-batidos.jpg",    new: "guarapo.jpg" }
};
function applyImageFixes(catalog) {
  let fixed = 0;
  for (const d of (catalog && catalog.departments) || []) {
    for (const c of d.categories || []) {
      for (const it of c.items || []) {
        const fx = it && IMAGE_FIXES[it.id];
        if (fx && it.image === fx.old) {
          it.image = fx.new;
          fixed++;
        }
      }
    }
  }
  return fixed;
}

// Migración de traducción v5 (2026-09-28, pedido de Portal): todo el
// storefront del cliente al español. Owner-safe: cada campo solo se
// traduce si su valor actual es EXACTAMENTE el inglés original de la
// semilla. Si la dueña ya editó algo en /store, se respeta. Idempotente.
const ES_DEPT_NAMES = {
  "sandwiches": ["Sandwiches", "Sándwiches"],
  "pastelitos": ["Pastelitos & Bakery", "Pastelitos y Panadería"],
  "cafe": ["Cuban Coffee", "Café Cubano"],
  "desayunos": ["Breakfast", "Desayunos"],
  "batidos": ["Shakes & Juices", "Batidos y Jugos"]
};
const ES_CAT_NAMES = {
  "pressed-sandwiches": ["Pressed on Cuban bread", "Prensados en pan cubano"],
  "croquetas-ham": ["Ham croquettes", "Croquetas de jamón"]
};
// id -> { campo: [inglesOriginal, espanolNuevo] }
const ES_ITEM_FIELDS = {
  "cuban-sandwich": {
    unit: ["sandwich", "sándwich"],
    tag: ["The icon", "El ícono"],
    desc: ["Slow-roasted pork, ham, Swiss cheese, pickles and mustard, pressed hot on fresh Cuban bread.",
           "Cerdo asado a fuego lento, jamón, queso suizo, pepinillos y mostaza, prensado caliente en pan cubano fresco."] },
  "media-noche": {
    unit: ["sandwich", "sándwich"],
    desc: ["The Cuban sandwich's sweet cousin — same fillings on soft, sweet egg bread, pressed golden.",
           "La prima dulce del sándwich cubano — el mismo relleno en pan de huevo suave y dulce, prensado dorado."] },
  "pan-bistec": {
    unit: ["sandwich", "sándwich"],
    desc: ["Thin-sliced seasoned steak with grilled onions, pressed on Cuban bread.",
           "Bistec sazonado en lascas finas con cebolla a la plancha, prensado en pan cubano."] },
  "pan-lechon": {
    unit: ["sandwich", "sándwich"],
    desc: ["Juicy roast pork with mojo onions, pressed on Cuban bread.",
           "Lechón jugoso con cebolla en mojo, prensado en pan cubano."] },
  "pan-croqueta": {
    unit: ["sandwich", "sándwich"],
    desc: ["Crispy ham croquettes tucked into Cuban bread — the working-class classic.",
           "Croquetas de jamón crujientes dentro del pan cubano — el clásico del trabajador."] },
  "croq-6": {
    unit: ["order", "orden"],
    tag: ["Fried to order", "Fritas al momento"],
    desc: ["Golden, creamy ham croquettes — fried to order. Acclaimed as some of the best in Florida.",
           "Croquetas de jamón doradas y cremosas — fritas al momento. Dicen que son de las mejores de Florida."] },
  "croq-12": {
    unit: ["order", "orden"],
    desc: ["A dozen of our famous ham croquettes. For the table — or just for you.",
           "Una docena de nuestras famosas croquetas de jamón. Para la mesa — o solo para ti."] },
  "past-guayaba": {
    unit: ["each", "c/u"],
    desc: ["Flaky puff pastry filled with sweet guava paste.",
           "Hojaldre crujiente relleno de dulce pasta de guayaba."] },
  "past-queso": {
    unit: ["each", "c/u"],
    desc: ["Flaky pastry with a creamy cheese filling.",
           "Hojaldre con relleno cremoso de queso."] },
  "past-carne": {
    unit: ["each", "c/u"],
    desc: ["Seasoned ground beef wrapped in flaky pastry.",
           "Carne molida sazonada envuelta en hojaldre."] },
  "past-guayaba-queso": {
    unit: ["each", "c/u"],
    tag: ["Customer favorite", "Favorita de la clientela"],
    desc: ["The perfect marriage: sweet guava and creamy cheese in flaky pastry.",
           "El matrimonio perfecto: guayaba dulce y queso cremoso en hojaldre."] },
  "pizza-pastel": {
    unit: ["each", "c/u"],
    desc: ["Pizza flavors in a flaky pastelito — cheese, sauce and pepperoni.",
           "Sabor a pizza en un pastelito de hojaldre — queso, salsa y pepperoni."] },
  "emp-jamon-queso": {
    unit: ["each", "c/u"],
    desc: ["Ham and cheese empanada, baked golden.",
           "Empanada de jamón y queso, horneada dorada."] },
  "emp-pollo": {
    unit: ["each", "c/u"],
    desc: ["Shredded chicken empanada, baked golden.",
           "Empanada de pollo deshebrado, horneada dorada."] },
  "emp-carne": {
    unit: ["each", "c/u"],
    desc: ["Seasoned beef empanada, baked golden.",
           "Empanada de carne sazonada, horneada dorada."] },
  "cangrejito-jamon": {
    unit: ["each", "c/u"],
    tag: ["Customer favorite", "Favorita de la clientela"],
    desc: ["Flaky golden crescent stuffed with ham and cheese — the Cuban bakery classic.",
           "Medialuna dorada de hojaldre rellena de jamón y queso — el clásico de la panadería cubana."] },
  "cangrejito-chorizo": {
    unit: ["each", "c/u"],
    desc: ["Flaky golden crescent stuffed with savory chorizo.",
           "Medialuna dorada de hojaldre rellena de chorizo sabroso."] },
  "cafecito": {
    unit: ["shot", "tacita"],
    desc: ["Strong, sweet Cuban espresso. The 3:05 ritual.",
           "Café cubano fuerte y dulce. El ritual de las 3:05."] },
  "cortadito": {
    unit: ["cup", "taza"],
    desc: ["Cuban espresso cut with steamed milk.",
           "Café cubano cortado con leche al vapor."] },
  "colada": {
    unit: ["4oz", "4 oz"],
    desc: ["A full round of cafecito for sharing — the Cuban way.",
           "Una ronda completa de cafecito para compartir — a lo cubano."] },
  "cafe-leche-s": {
    name: ["Café con Leche (Small)", "Café con Leche (Pequeño)"],
    unit: ["cup", "taza"],
    desc: ["Cuban coffee with hot milk. Made for dunking tostadas.",
           "Café cubano con leche caliente. Hecho para mojar tostadas."] },
  "cafe-leche-l": {
    name: ["Café con Leche (Large)", "Café con Leche (Grande)"],
    unit: ["cup", "taza"],
    desc: ["The big morning cup of café con leche.",
           "La taza grande de la mañana de café con leche."] },
  "huevos-fritos": {
    unit: ["plate", "plato"],
    desc: ["Fried eggs served with Cuban toast.",
           "Huevos fritos servidos con tostada cubana."] },
  "huevos-revueltos": {
    unit: ["plate", "plato"],
    desc: ["Scrambled eggs with ham, served with Cuban toast.",
           "Huevos revueltos con jamón, servidos con tostada cubana."] },
  "tortilla-espanola": {
    unit: ["plate", "plato"],
    desc: ["Classic Spanish potato omelet, served with Cuban toast.",
           "Clásica tortilla española de papa, servida con tostada cubana."] },
  "tostadas": {
    unit: ["order", "orden"],
    desc: ["Buttered, pressed Cuban toast — made for dunking in café con leche.",
           "Tostada cubana con mantequilla y prensada — hecha para mojar en el café con leche."] },
  "tortilla-gusto": {
    unit: ["plate", "plato"],
    desc: ["Omelet your way — tell us your fillings in the order note.",
           "Tortilla a tu gusto — dinos el relleno en la nota del pedido."] },
  "batido-mango": {
    unit: ["glass", "vaso"],
    desc: ["Fresh mango milkshake, blended thick.",
           "Batido de mango fresco, bien espeso."] },
  "batido-mamey": {
    unit: ["glass", "vaso"],
    desc: ["Creamy mamey milkshake — a Cuban classic.",
           "Batido cremoso de mamey — un clásico cubano."] },
  "batido-guayaba": {
    unit: ["glass", "vaso"],
    desc: ["Sweet guava milkshake.",
           "Batido dulce de guayaba."] },
  "guarapo": {
    unit: ["glass", "vaso"],
    tag: ["Fresh pressed", "Recién exprimido"],
    desc: ["Fresh-pressed sugarcane juice. Pure Cuba in a glass.",
           "Jugo de caña recién exprimido. Cuba pura en un vaso."] },
  "jugo-naranja": {
    name: ["Freshly Squeezed Orange Juice", "Jugo de Naranja Recién Exprimido"],
    unit: ["glass", "vaso"],
    tag: ["Fresh squeezed", "Recién exprimido"],
    desc: ["Freshly squeezed orange juice, served chilled — pure sunshine in a glass.",
           "Jugo de naranja recién exprimido, servido frío — puro sol en un vaso."] }
};
function applySpanishMigration(catalog) {
  let n = 0;
  for (const d of (catalog && catalog.departments) || []) {
    const dn = ES_DEPT_NAMES[d.id];
    if (dn && d.name === dn[0]) { d.name = dn[1]; n++; }
    for (const c of d.categories || []) {
      const cn = ES_CAT_NAMES[c.id];
      if (cn && c.name === cn[0]) { c.name = cn[1]; n++; }
      for (const it of c.items || []) {
        const fx = it && ES_ITEM_FIELDS[it.id];
        if (!fx) continue;
        for (const f of ["name", "desc", "unit", "tag"]) {
          const pair = fx[f];
          if (pair && it[f] === pair[0]) { it[f] = pair[1]; n++; }
        }
      }
    }
  }
  return n;
}
// v3 (2026-09-28): tile de Pastelitos & Bakery usa la foto propia de Portal.
const DEPT_IMAGE_FIXES = {
  "pastelitos": { old: "dept-pastelitos.jpg", new: "portal-pastelitos-tray.jpg" }
};
function applyDeptImageFixes(catalog) {
  let fixed = 0;
  for (const d of (catalog && catalog.departments) || []) {
    const fx = d && DEPT_IMAGE_FIXES[d.id];
    if (fx && d.iconImg === fx.old) {
      d.iconImg = fx.new;
      fixed++;
    }
  }
  return fixed;
}

async function init() {
  if (process.env.DATABASE_URL) {
    const { Pool } = require("pg");
    const url = process.env.DATABASE_URL;
    // Render/Supabase/etc. exigen SSL; local no.
    const local = /localhost|127\.0\.0\.1/.test(url);
    pool = new Pool({
      connectionString: url,
      ssl: local ? false : { rejectUnauthorized: false }
    });
    await pool.query(PG_SCHEMA);
    kind = "pg";
    console.log("[sweet-bakery] DB: Postgres");
  } else {
    const { DatabaseSync } = require("node:sqlite");
    sdb = new DatabaseSync(path.join(__dirname, "sweet-bakery.db"));
    sdb.exec(SQLITE_SCHEMA);
    kind = "sqlite";
    console.log("[sweet-bakery] DB: SQLite local (sweet-bakery.db)");
  }

  // Semilla solo si no existe; al subir CATALOG_VERSION se FUSIONA (nunca se borra).
  if (!(await kvGet("catalog"))) {
    await kvSet("catalog", JSON.stringify(SEED_CATALOG));
    await kvSet("catalog_version", String(CATALOG_VERSION));
    console.log("[sweet-bakery] Catálogo semilla cargado.");
  } else {
    const v = await kvGet("catalog_version");
    if (v !== String(CATALOG_VERSION)) {
      let live = null;
      try { live = JSON.parse(await kvGet("catalog")); } catch { live = null; }
      const m = mergeCatalog(live, SEED_CATALOG);
      const fx = applyImageFixes(m.catalog);
      const dfx = applyDeptImageFixes(m.catalog);
      const esn = applySpanishMigration(m.catalog);
      await kvSet("catalog", JSON.stringify(m.catalog));
      await kvSet("catalog_version", String(CATALOG_VERSION));
      console.log(`[sweet-bakery] Catálogo fusionado (v${v} → v${CATALOG_VERSION}): +${m.added} nuevos, ${m.filled} campos rellenados, ${fx} fotos corregidas, ${dfx} tiles depto corregidos, ${esn} campos traducidos. Lo del dueño intacto.`);
    }
  }
  if (!(await kvGet("order_seq"))) await kvSet("order_seq", "0");
  return kind;
}

function dbKind() { return kind; }

// ---------- kv ----------
async function kvGet(key) {
  if (kind === "pg") {
    const r = await pool.query("SELECT value FROM kv WHERE key = $1", [key]);
    return r.rows.length ? r.rows[0].value : null;
  }
  const row = sdb.prepare("SELECT value FROM kv WHERE key = ?").get(key);
  return row ? row.value : null;
}

async function kvSet(key, value) {
  if (kind === "pg") {
    await pool.query(
      "INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [key, value]
    );
    return;
  }
  sdb.prepare(
    "INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
}

// ---------- catálogo ----------
async function getCatalog() {
  return JSON.parse(await kvGet("catalog"));
}
async function setCatalog(cat) {
  await kvSet("catalog", JSON.stringify(cat));
}

// ---------- pedidos ----------
function mapOrder(row) {
  return {
    id: row.id,
    number: row.number,
    type: row.type,
    items: JSON.parse(row.items),
    customer: JSON.parse(row.customer),
    payment: row.payment,
    notes: row.notes || "",
    status: row.status,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

// Número de pedido secuencial, atómico en ambos backends.
async function nextOrderNumber() {
  let seq;
  if (kind === "pg") {
    const r = await pool.query(
      `INSERT INTO kv (key, value) VALUES ('order_seq', '1')
       ON CONFLICT(key) DO UPDATE SET value = ((kv.value)::int + 1)::text
       RETURNING value`
    );
    seq = Number(r.rows[0].value);
  } else {
    seq = Number(await kvGet("order_seq")) + 1;
    await kvSet("order_seq", String(seq));
  }
  return "#" + String(seq).padStart(3, "0");
}

async function createOrder({ number, type, items, customer, payment, notes, status }) {
  const st = status || "nuevo";
  if (kind === "pg") {
    const r = await pool.query(
      `INSERT INTO orders (number, type, items, customer, payment, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [number, type, JSON.stringify(items), JSON.stringify(customer), payment, notes || null, st]
    );
    return mapOrder(r.rows[0]);
  }
  const info = sdb.prepare(
    "INSERT INTO orders (number, type, items, customer, payment, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(number, type, JSON.stringify(items), JSON.stringify(customer), payment, notes || null, st);
  const row = sdb.prepare("SELECT * FROM orders WHERE id = ?").get(info.lastInsertRowid);
  return mapOrder(row);
}

async function listOrders() {
  if (kind === "pg") {
    const r = await pool.query("SELECT * FROM orders ORDER BY id DESC LIMIT 200");
    return r.rows.map(mapOrder);
  }
  return sdb.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 200").all().map(mapOrder);
}

async function getOrder(id) {
  if (kind === "pg") {
    const r = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    return r.rows.length ? mapOrder(r.rows[0]) : null;
  }
  const row = sdb.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  return row ? mapOrder(row) : null;
}

async function updateOrderStatus(id, status) {
  if (kind === "pg") {
    const r = await pool.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    return r.rows.length ? mapOrder(r.rows[0]) : null;
  }
  const row = sdb.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!row) return null;
  sdb.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  return mapOrder(sdb.prepare("SELECT * FROM orders WHERE id = ?").get(id));
}

// Solo para limpieza de pruebas (no se expone en la API).
async function deleteOrder(id) {
  if (kind === "pg") {
    await pool.query("DELETE FROM orders WHERE id = $1", [id]);
  } else {
    sdb.prepare("DELETE FROM orders WHERE id = ?").run(id);
  }
}

// Limpieza total del historial desde /tienda (boton "Limpiar historial").
async function deleteAllOrders() {
  if (kind === "pg") {
    await pool.query("DELETE FROM orders");
    await pool.query("UPDATE kv SET value = '0' WHERE key = 'order_seq'");
  } else {
    sdb.prepare("DELETE FROM orders").run();
    sdb.prepare("UPDATE kv SET value = '0' WHERE key = 'order_seq'").run();
  }
}

module.exports = {
  init,
  dbKind,
  kvGet,
  kvSet,
  getCatalog,
  setCatalog,
  nextOrderNumber,
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  deleteAllOrders
};
