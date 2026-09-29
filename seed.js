// ============================================================
// SEED CATALOG — Sweet Bakery Cafeteria (Homestead, FL)
// Panadería y cafetería cubana. 1467 N Krome Ave, Homestead, FL 33030
// Teléfono: 305-242-0717. Sitio: sweetbakerycafeteria.shop
// Moneda: USD. Pagos: Efectivo / Zelle (pago pendiente).
// Solo recogida (pickup). Interfaz del cliente: 100% español.
//
// ⚠️  PRECIOS BORRADOR — NO CONFIRMADOS POR LA DUEÑA.
// Los menús del local no se leían bien, así que cada precio
// es un estimado razonable de una cafetería cubana de Homestead.
// Portal confirmará/corregirá cada precio con la dueña en su
// visita con cámara. Todo es editable en /store (pestaña Catálogo).
// Fotos: 29 fotos AI por plato (únicas por plato) — Portal las
// cambiará por fotos REALES después (su regla: lo real le gana a AI).
//
// CATALOG_VERSION: subir para re-sembrar (la fusión es solo
// aditiva — lo que la dueña edite en /store nunca se borra).
// v5 (2026-09-28, pedido de Portal): todo el storefront en español;
// solo recogida.
// ============================================================

const CATALOG_VERSION = 5;

const SEED_CATALOG = {
  departments: [
    {
      id: "sandwiches",
      name: "Sándwiches",
      icon: "🥪",
      iconImg: "dept-sandwiches.jpg",
      categories: [
        {
          id: "pressed-sandwiches",
          name: "Prensados en pan cubano",
          items: [
            { id: "cuban-sandwich", name: "Cuban Sandwich", price: 9.50, unit: "sándwich", active: true, image: "cuban-sandwich.jpg",
              tag: "El ícono",
              desc: "Cerdo asado a fuego lento, jamón, queso suizo, pepinillos y mostaza, prensado caliente en pan cubano fresco." },
            { id: "media-noche", name: "Media Noche", price: 9.75, unit: "sándwich", active: true, image: "media-noche.jpg",
              desc: "La prima dulce del sándwich cubano — el mismo relleno en pan de huevo suave y dulce, prensado dorado." },
            { id: "pan-bistec", name: "Pan con Bistec", price: 10.50, unit: "sándwich", active: true, image: "pan-bistec.jpg",
              desc: "Bistec sazonado en lascas finas con cebolla a la plancha, prensado en pan cubano." },
            { id: "pan-lechon", name: "Pan con Lechón", price: 10.50, unit: "sándwich", active: true, image: "pan-lechon.jpg",
              desc: "Lechón jugoso con cebolla en mojo, prensado en pan cubano." },
            { id: "pan-croqueta", name: "Pan con Croqueta (Preparada)", price: 8.50, unit: "sándwich", active: true, image: "pan-croqueta.jpg",
              desc: "Croquetas de jamón crujientes dentro del pan cubano — el clásico del trabajador." }
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
          name: "Croquetas de jamón",
          items: [
            { id: "croq-6", name: "Croquetas de Jamón (6 pc)", price: 4.50, unit: "orden", active: true, image: "croq-6.jpg",
              tag: "Fritas al momento",
              desc: "Croquetas de jamón doradas y cremosas — fritas al momento. Dicen que son de las mejores de Florida." },
            { id: "croq-12", name: "Croquetas de Jamón (12 pc)", price: 8.50, unit: "orden", active: true, image: "croq-12.jpg",
              desc: "Una docena de nuestras famosas croquetas de jamón. Para la mesa — o solo para ti." }
          ]
        }
      ]
    },
    {
      id: "pastelitos",
      name: "Pastelitos y Panadería",
      icon: "🥐",
      iconImg: "portal-pastelitos-tray.jpg",
      categories: [
        {
          id: "pastelitos-dulces",
          name: "Pastelitos",
          items: [
            { id: "past-guayaba", name: "Pastelito de Guayaba", price: 2.25, unit: "c/u", active: true, image: "past-guayaba.jpg",
              desc: "Hojaldre crujiente relleno de dulce pasta de guayaba." },
            { id: "past-queso", name: "Pastelito de Queso", price: 2.25, unit: "c/u", active: true, image: "past-queso.jpg",
              desc: "Hojaldre con relleno cremoso de queso." },
            { id: "past-carne", name: "Pastelito de Carne", price: 2.50, unit: "c/u", active: true, image: "past-carne.jpg",
              desc: "Carne molida sazonada envuelta en hojaldre." },
            { id: "past-guayaba-queso", name: "Pastelito de Guayaba y Queso", price: 2.50, unit: "c/u", active: true, image: "past-guayaba-queso.jpg",
              tag: "Favorita de la clientela",
              desc: "El matrimonio perfecto: guayaba dulce y queso cremoso en hojaldre." },
            { id: "pizza-pastel", name: "Pizza Pastel", price: 3.25, unit: "c/u", active: true, image: "pizza-pastel.jpg",
              desc: "Sabor a pizza en un pastelito de hojaldre — queso, salsa y pepperoni." }
          ]
        },
        {
          id: "empanadas",
          name: "Empanadas",
          items: [
            { id: "emp-jamon-queso", name: "Empanada de Jamón y Queso", price: 3.00, unit: "c/u", active: true, image: "emp-jamon-queso.jpg",
              desc: "Empanada de jamón y queso, horneada dorada." },
            { id: "emp-pollo", name: "Empanada de Pollo", price: 3.00, unit: "c/u", active: true, image: "emp-pollo.jpg",
              desc: "Empanada de pollo deshebrado, horneada dorada." },
            { id: "emp-carne", name: "Empanada de Carne", price: 3.00, unit: "c/u", active: true, image: "emp-carne.jpg",
              desc: "Empanada de carne sazonada, horneada dorada." }
          ]
        },
        {
          id: "cangrejitos",
          name: "Cangrejitos",
          items: [
            { id: "cangrejito-jamon", name: "Cangrejito de Jamón", price: 3.25, unit: "c/u", active: true, image: "cangrejito-jamon.jpg",
              tag: "Favorita de la clientela",
              desc: "Medialuna dorada de hojaldre rellena de jamón y queso — el clásico de la panadería cubana." },
            { id: "cangrejito-chorizo", name: "Cangrejito de Chorizo", price: 3.25, unit: "c/u", active: true, image: "cangrejito-chorizo.jpg",
              desc: "Medialuna dorada de hojaldre rellena de chorizo sabroso." }
          ]
        }
      ]
    },
    {
      id: "cafe",
      name: "Café Cubano",
      icon: "☕",
      iconImg: "dept-cafe.jpg",
      categories: [
        {
          id: "cafecitos",
          name: "Cafecitos",
          items: [
            { id: "cafecito", name: "Café Cubano", price: 1.50, unit: "tacita", active: true, image: "cafecito.jpg",
              desc: "Café cubano fuerte y dulce. El ritual de las 3:05." },
            { id: "cortadito", name: "Cortadito", price: 2.25, unit: "taza", active: true, image: "cortadito.jpg",
              desc: "Café cubano cortado con leche al vapor." },
            { id: "colada", name: "Colada", price: 4.00, unit: "4 oz", active: true, image: "colada.jpg",
              tag: "Para compartir",
              desc: "Una ronda completa de cafecito para compartir — a lo cubano." },
            { id: "cafe-leche-s", name: "Café con Leche (Pequeño)", price: 2.75, unit: "taza", active: true, image: "cafe-leche-s.jpg",
              desc: "Café cubano con leche caliente. Hecho para mojar tostadas." },
            { id: "cafe-leche-l", name: "Café con Leche (Grande)", price: 3.75, unit: "taza", active: true, image: "cafe-leche-l.jpg",
              desc: "La taza grande de la mañana de café con leche." }
          ]
        }
      ]
    },
    {
      id: "desayunos",
      name: "Desayunos",
      icon: "🍳",
      iconImg: "dept-desayunos.jpg",
      categories: [
        {
          id: "desayuno-platos",
          name: "Desayunos",
          items: [
            { id: "huevos-fritos", name: "Huevos Fritos", price: 7.50, unit: "plato", active: true, image: "huevos-fritos.jpg",
              desc: "Huevos fritos servidos con tostada cubana." },
            { id: "huevos-revueltos", name: "Huevos Revueltos con Jamón", price: 8.50, unit: "plato", active: true, image: "huevos-revueltos.jpg",
              desc: "Huevos revueltos con jamón, servidos con tostada cubana." },
            { id: "tortilla-espanola", name: "Tortilla Española", price: 8.00, unit: "plato", active: true, image: "tortilla-espanola.jpg",
              desc: "Clásica tortilla española de papa, servida con tostada cubana." },
            { id: "tostadas", name: "Tostadas Cubanas", price: 4.50, unit: "orden", active: true, image: "tostadas.jpg",
              desc: "Tostada cubana con mantequilla y prensada — hecha para mojar en el café con leche." },
            { id: "tortilla-gusto", name: "Tortilla a su Gusto", price: 9.00, unit: "plato", active: true, image: "tortilla-gusto.jpg",
              desc: "Tortilla a tu gusto — dinos el relleno en la nota del pedido." }
          ]
        }
      ]
    },
    {
      id: "batidos",
      name: "Batidos y Jugos",
      icon: "🥤",
      iconImg: "dept-batidos.jpg",
      categories: [
        {
          id: "batidos-fruta",
          name: "Batidos de frutas",
          items: [
            { id: "batido-mango", name: "Batido de Mango", price: 5.50, unit: "vaso", active: true, image: "batido-mango.jpg",
              desc: "Batido de mango fresco, bien espeso." },
            { id: "batido-mamey", name: "Batido de Mamey", price: 5.50, unit: "vaso", active: true, image: "batido-mamey.jpg",
              desc: "Batido cremoso de mamey — un clásico cubano." },
            { id: "batido-guayaba", name: "Batido de Guayaba", price: 5.50, unit: "vaso", active: true, image: "batido-guayaba.jpg",
              desc: "Batido dulce de guayaba." },
            { id: "guarapo", name: "Guarapo", price: 5.00, unit: "vaso", active: true, image: "guarapo.jpg",
              tag: "Recién exprimido",
              desc: "Jugo de caña recién exprimido. Cuba pura en un vaso." }
          ]
        },
        {
          id: "jugos-frescos",
          name: "Jugos frescos",
          items: [
            { id: "jugo-naranja", name: "Jugo de Naranja Recién Exprimido", price: 6.50, unit: "vaso", active: true, image: "fresh-orange-juice.jpg",
              tag: "Recién exprimido",
              desc: "Jugo de naranja recién exprimido, servido frío — puro sol en un vaso." }
          ]
        }
      ]
    }
  ]
};

module.exports = { SEED_CATALOG, CATALOG_VERSION };
