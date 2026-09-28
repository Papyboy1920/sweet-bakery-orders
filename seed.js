// ============================================================
// SEED CATALOG — Sweet Bakery Cafeteria (Homestead, FL)
// Cuban bakery & cafeteria. 1467 N Krome Ave, Homestead, FL 33030
// Phone: 305-242-0717. Site: sweetbakerycafeteria.shop
// Currency: USD. Payments: Cash / Zelle (pending payment).
// Pickup + Delivery.
//
// ⚠️  DRAFT PRICES — NOT OWNER-CONFIRMED.
// The menu boards on their site were unreadable, so every price
// below is a reasonable Homestead Cuban-cafeteria estimate.
// Portal will confirm/correct every price with the owner on his
// camera visit. All prices are editable in /store (Catalog tab).
// Photos: 29 per-item AI placeholders (unique per dish) — Portal will
// swap in LIVE photos later (his rule: real beats AI).
//
// CATALOG_VERSION: bump to re-seed (merge is additive-only —
// owner /store edits are never wiped).
// ============================================================

const CATALOG_VERSION = 3;

const SEED_CATALOG = {
  departments: [
    {
      id: "sandwiches",
      name: "Sandwiches",
      icon: "🥪",
      iconImg: "dept-sandwiches.jpg",
      categories: [
        {
          id: "pressed-sandwiches",
          name: "Pressed on Cuban bread",
          items: [
            { id: "cuban-sandwich", name: "Cuban Sandwich", price: 9.50, unit: "sandwich", active: true, image: "cuban-sandwich.jpg",
              tag: "The icon",
              desc: "Slow-roasted pork, ham, Swiss cheese, pickles and mustard, pressed hot on fresh Cuban bread." },
            { id: "media-noche", name: "Media Noche", price: 9.75, unit: "sandwich", active: true, image: "media-noche.jpg",
              desc: "The Cuban sandwich's sweet cousin — same fillings on soft, sweet egg bread, pressed golden." },
            { id: "pan-bistec", name: "Pan con Bistec", price: 10.50, unit: "sandwich", active: true, image: "pan-bistec.jpg",
              desc: "Thin-sliced seasoned steak with grilled onions, pressed on Cuban bread." },
            { id: "pan-lechon", name: "Pan con Lechón", price: 10.50, unit: "sandwich", active: true, image: "pan-lechon.jpg",
              desc: "Juicy roast pork with mojo onions, pressed on Cuban bread." },
            { id: "pan-croqueta", name: "Pan con Croqueta (Preparada)", price: 8.50, unit: "sandwich", active: true, image: "pan-croqueta.jpg",
              desc: "Crispy ham croquettes tucked into Cuban bread — the working-class classic." }
          ]
        }
      ]
    },
    {
      id: "croquetas",
      name: "Croquetas & Frituras",
      icon: "🧆",
      iconImg: "dept-croquetas.jpg",
      categories: [
        {
          id: "croquetas-ham",
          name: "Ham croquettes",
          items: [
            { id: "croq-6", name: "Croquetas de Jamón (6 pc)", price: 4.50, unit: "order", active: true, image: "croq-6.jpg",
              tag: "Fried to order",
              desc: "Golden, creamy ham croquettes — fried to order. Acclaimed as some of the best in Florida." },
            { id: "croq-12", name: "Croquetas de Jamón (12 pc)", price: 8.50, unit: "order", active: true, image: "croq-12.jpg",
              desc: "A dozen of our famous ham croquettes. For the table — or just for you." }
          ]
        }
      ]
    },
    {
      id: "pastelitos",
      name: "Pastelitos & Bakery",
      icon: "🥐",
      iconImg: "portal-pastelitos-tray.jpg",
      categories: [
        {
          id: "pastelitos-dulces",
          name: "Pastelitos",
          items: [
            { id: "past-guayaba", name: "Pastelito de Guayaba", price: 2.25, unit: "each", active: true, image: "past-guayaba.jpg",
              desc: "Flaky puff pastry filled with sweet guava paste." },
            { id: "past-queso", name: "Pastelito de Queso", price: 2.25, unit: "each", active: true, image: "past-queso.jpg",
              desc: "Flaky pastry with a creamy cheese filling." },
            { id: "past-carne", name: "Pastelito de Carne", price: 2.50, unit: "each", active: true, image: "past-carne.jpg",
              desc: "Seasoned ground beef wrapped in flaky pastry." },
            { id: "past-guayaba-queso", name: "Pastelito de Guayaba y Queso", price: 2.50, unit: "each", active: true, image: "past-guayaba-queso.jpg",
              tag: "Customer favorite",
              desc: "The perfect marriage: sweet guava and creamy cheese in flaky pastry." },
            { id: "pizza-pastel", name: "Pizza Pastel", price: 3.25, unit: "each", active: true, image: "pizza-pastel.jpg",
              desc: "Pizza flavors in a flaky pastelito — cheese, sauce and pepperoni." }
          ]
        },
        {
          id: "empanadas",
          name: "Empanadas",
          items: [
            { id: "emp-jamon-queso", name: "Empanada de Jamón y Queso", price: 3.00, unit: "each", active: true, image: "emp-jamon-queso.jpg",
              desc: "Ham and cheese empanada, baked golden." },
            { id: "emp-pollo", name: "Empanada de Pollo", price: 3.00, unit: "each", active: true, image: "emp-pollo.jpg",
              desc: "Shredded chicken empanada, baked golden." },
            { id: "emp-carne", name: "Empanada de Carne", price: 3.00, unit: "each", active: true, image: "emp-carne.jpg",
              desc: "Seasoned beef empanada, baked golden." }
          ]
        },
        {
          id: "cangrejitos",
          name: "Cangrejitos",
          items: [
            { id: "cangrejito-jamon", name: "Cangrejito de Jamón", price: 3.25, unit: "each", active: true, image: "cangrejito-jamon.jpg",
              tag: "Customer favorite",
              desc: "Flaky golden crescent stuffed with ham and cheese — the Cuban bakery classic." },
            { id: "cangrejito-chorizo", name: "Cangrejito de Chorizo", price: 3.25, unit: "each", active: true, image: "cangrejito-chorizo.jpg",
              desc: "Flaky golden crescent stuffed with savory chorizo." }
          ]
        }
      ]
    },
    {
      id: "cafe",
      name: "Cuban Coffee",
      icon: "☕",
      iconImg: "dept-cafe.jpg",
      categories: [
        {
          id: "cafecitos",
          name: "Cafecitos",
          items: [
            { id: "cafecito", name: "Café Cubano", price: 1.50, unit: "shot", active: true, image: "cafecito.jpg",
              desc: "Strong, sweet Cuban espresso. The 3:05 ritual." },
            { id: "cortadito", name: "Cortadito", price: 2.25, unit: "cup", active: true, image: "cortadito.jpg",
              desc: "Cuban espresso cut with steamed milk." },
            { id: "colada", name: "Colada", price: 4.00, unit: "4oz", active: true, image: "colada.jpg",
              tag: "Para compartir",
              desc: "A full round of cafecito for sharing — the Cuban way." },
            { id: "cafe-leche-s", name: "Café con Leche (Small)", price: 2.75, unit: "cup", active: true, image: "cafe-leche-s.jpg",
              desc: "Cuban coffee with hot milk. Made for dunking tostadas." },
            { id: "cafe-leche-l", name: "Café con Leche (Large)", price: 3.75, unit: "cup", active: true, image: "cafe-leche-l.jpg",
              desc: "The big morning cup of café con leche." }
          ]
        }
      ]
    },
    {
      id: "desayunos",
      name: "Breakfast",
      icon: "🍳",
      iconImg: "dept-desayunos.jpg",
      categories: [
        {
          id: "desayuno-platos",
          name: "Desayunos",
          items: [
            { id: "huevos-fritos", name: "Huevos Fritos", price: 7.50, unit: "plate", active: true, image: "huevos-fritos.jpg",
              desc: "Fried eggs served with Cuban toast." },
            { id: "huevos-revueltos", name: "Huevos Revueltos con Jamón", price: 8.50, unit: "plate", active: true, image: "huevos-revueltos.jpg",
              desc: "Scrambled eggs with ham, served with Cuban toast." },
            { id: "tortilla-espanola", name: "Tortilla Española", price: 8.00, unit: "plate", active: true, image: "tortilla-espanola.jpg",
              desc: "Classic Spanish potato omelet, served with Cuban toast." },
            { id: "tostadas", name: "Tostadas Cubanas", price: 4.50, unit: "order", active: true, image: "tostadas.jpg",
              desc: "Buttered, pressed Cuban toast — made for dunking in café con leche." },
            { id: "tortilla-gusto", name: "Tortilla a su Gusto", price: 9.00, unit: "plate", active: true, image: "tortilla-gusto.jpg",
              desc: "Omelet your way — tell us your fillings in the order note." }
          ]
        }
      ]
    },
    {
      id: "batidos",
      name: "Shakes & Juices",
      icon: "🥤",
      iconImg: "dept-batidos.jpg",
      categories: [
        {
          id: "batidos-fruta",
          name: "Batidos de frutas",
          items: [
            { id: "batido-mango", name: "Batido de Mango", price: 5.50, unit: "glass", active: true, image: "batido-mango.jpg",
              desc: "Fresh mango milkshake, blended thick." },
            { id: "batido-mamey", name: "Batido de Mamey", price: 5.50, unit: "glass", active: true, image: "batido-mamey.jpg",
              desc: "Creamy mamey milkshake — a Cuban classic." },
            { id: "batido-guayaba", name: "Batido de Guayaba", price: 5.50, unit: "glass", active: true, image: "batido-guayaba.jpg",
              desc: "Sweet guava milkshake." },
            { id: "guarapo", name: "Guarapo", price: 5.00, unit: "glass", active: true, image: "guarapo.jpg",
              tag: "Fresh pressed",
              desc: "Fresh-pressed sugarcane juice. Pure Cuba in a glass." }
          ]
        }
      ]
    }
  ]
};

module.exports = { SEED_CATALOG, CATALOG_VERSION };
