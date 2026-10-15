// Catálogo de la tienda. Editá este archivo para cambiar productos, precios y datos de contacto.
// Los nombres, precios y condiciones son de ejemplo: reemplazalos por los reales.
window.TIENDA = {
  config: {
    // Número con código de país, sin "+" ni espacios. Ej: "5491112345678". Vacío = pedido por WhatsApp deshabilitado.
    whatsapp: "",
    // Calculadora de producción: ancho de tela de referencia y merma por tizado.
    anchoTela: 1.5,
    merma: 0.08,
  },

  categorias: [
    { id: "remeras", label: "Remeras y tops" },
    { id: "buzos", label: "Buzos" },
    { id: "camperas", label: "Camperas" },
    { id: "camisas", label: "Camisas" },
    { id: "pantalones", label: "Pantalones y shorts" },
    { id: "descanso", label: "Descanso" },
  ],

  niveles: [
    { id: "basico", label: "Básico", n: 1 },
    { id: "intermedio", label: "Intermedio", n: 2 },
    { id: "avanzado", label: "Avanzado", n: 3 },
  ],

  tejidos: {
    jersey: "Jersey", pique: "Piqué", lycra: "Lycra", frisa: "Frisa", rustico: "Rústico",
    tafeta: "Tafeta", gabardina: "Gabardina", denim: "Denim", popelina: "Popelina",
    lino: "Lino", microfibra: "Microfibra", franela: "Franela",
  },

  // Consumo relativo al talle M, para la calculadora.
  talles: [
    { id: "S", consumo: 0.92 },
    { id: "M", consumo: 1 },
    { id: "L", consumo: 1.08 },
    { id: "XL", consumo: 1.16 },
    { id: "XXL", consumo: 1.24 },
    { id: "XXXL", consumo: 1.32 },
  ],

  // Descuento por cantidad de talles del mismo molde en un pedido.
  descuentos: [
    { desde: 3, pct: 15 },
    { desde: 6, pct: 25 },
  ],

  // `extra` se suma por cada talle.
  formatos: [
    { id: "pdf", label: "Digital", detalle: "PDF en A4 y A0 para plotter", extra: 0 },
    { id: "papel", label: "Papel", detalle: "Impreso a escala real", extra: 3500 },
  ],

  info: [
    { titulo: "Qué recibís", texto: "Cada talle con costuras incluidas, piquetes e hilo de tela marcados, tabla de medidas y una guía de armado paso a paso." },
    { titulo: "Envíos", texto: "El digital llega a tu email apenas confirmamos el pago. El impreso se despacha en 3 a 5 días hábiles con seguimiento." },
    { titulo: "Licencia", texto: "Podés producir y vender las prendas que confecciones. Lo que no está permitido es compartir o revender el molde." },
    { titulo: "Cambios", texto: "Si el impreso llega dañado, escribinos dentro de los 7 días y lo reponemos sin costo." },
  ],

  // silueta: remera | buzo | campera | camisa | pantalon | short
  // piezas: ver PIEZAS en tienda.js · consumo: metros de tela para una prenda talle M
  productos: [
    { id: "buzo-cafayate", nombre: "Buzo Cafayate", categoria: "buzos", silueta: "buzo", precio: 24000, nuevo: true,
      nivel: "intermedio", consumo: 1.8, tejidos: ["frisa", "rustico"],
      piezas: ["delantero", "espalda", "mangaLarga", "puno", "cintura", "bolsillo"],
      descripcion: "Buzo de hombro caído con bolsillo canguro y terminaciones en rib. Calce relajado." },
    { id: "remera-iruya", nombre: "Remera Iruya", categoria: "remeras", silueta: "remera", precio: 17000, nuevo: true,
      nivel: "basico", consumo: 1.1, tejidos: ["jersey"],
      piezas: ["delantero", "espalda", "mangaCorta", "cuelloRib"],
      descripcion: "Remera clásica de calce regular, ideal como primer molde o como básico de colección." },
    { id: "campera-maimara", nombre: "Campera Maimará", categoria: "camperas", silueta: "campera", precio: 28000,
      nivel: "avanzado", consumo: 2.2, tejidos: ["tafeta", "gabardina"],
      piezas: ["delantero", "espalda", "mangaLarga", "cuello", "tiraCierre", "bolsillo", "puno"],
      descripcion: "Rompevientos con cierre frontal, cuello alto y bolsillos ojal. Admite forrería." },
    { id: "pantalon-humahuaca", nombre: "Pantalón Humahuaca", categoria: "pantalones", silueta: "pantalon", precio: 23000,
      nivel: "intermedio", consumo: 1.5, tejidos: ["gabardina", "lino"],
      piezas: ["piernaDel", "piernaTras", "pretina", "bolsillo"],
      descripcion: "Pierna ancha con pinzas al frente y pretina recta. Cae muy bien en telas con cuerpo." },
    { id: "camisa-tafi", nombre: "Camisa Tafí", categoria: "camisas", silueta: "camisa", precio: 25000,
      nivel: "intermedio", consumo: 2, tejidos: ["popelina", "lino"],
      piezas: ["delantero", "espalda", "canesu", "mangaLarga", "cuello", "puno", "bolsillo"],
      descripcion: "Camisa oversize con canesú, bolsillo al pecho y puños con botón." },
    { id: "remera-tilcara", nombre: "Remera Tilcara", categoria: "remeras", silueta: "remera", precio: 18000,
      nivel: "basico", consumo: 1.3, tejidos: ["jersey", "pique"],
      piezas: ["delantero", "espalda", "mangaCorta", "cuelloRib"],
      descripcion: "Remera oversize de hombro caído y largo extendido. Pensada para jersey pesado." },
    { id: "chaqueta-purmamarca", nombre: "Chaqueta Purmamarca", categoria: "camperas", silueta: "campera", precio: 30000,
      nivel: "avanzado", consumo: 2, tejidos: ["denim", "gabardina"],
      piezas: ["delantero", "espalda", "canesu", "mangaLarga", "cuello", "bolsillo", "puno"],
      descripcion: "Chaqueta estilo trucker con canesú, bolsillos con tapa y pespuntes dobles." },
    { id: "buzo-amaicha", nombre: "Buzo Amaicha", categoria: "buzos", silueta: "buzo", precio: 26000,
      nivel: "intermedio", consumo: 2.1, tejidos: ["frisa"],
      piezas: ["delantero", "espalda", "mangaLarga", "capucha", "puno", "cintura", "bolsillo"],
      descripcion: "Buzo con capucha de dos piezas, bolsillo canguro y puños en rib." },
    { id: "jogger-cachi", nombre: "Jogger Cachi", categoria: "pantalones", silueta: "pantalon", precio: 21000,
      nivel: "basico", consumo: 1.4, tejidos: ["frisa", "rustico"],
      piezas: ["piernaDel", "piernaTras", "cintura", "bolsillo", "puno"],
      descripcion: "Jogger con cintura elastizada, bolsillos laterales y puño en el tobillo." },
    { id: "short-chiquita", nombre: "Short Mar Chiquita", categoria: "pantalones", silueta: "short", precio: 18000,
      nivel: "basico", consumo: 0.9, tejidos: ["microfibra", "lino"],
      piezas: ["piernaDel", "piernaTras", "pretina", "bolsillo"],
      descripcion: "Short de playa con cintura de cordón y bolsillo trasero. Secado rápido en microfibra." },
    { id: "top-uquia", nombre: "Top Uquía", categoria: "remeras", silueta: "remera", precio: 15000,
      nivel: "basico", consumo: 0.6, tejidos: ["jersey", "lycra"],
      piezas: ["delantero", "espalda", "mangaCorta", "cuelloRib"],
      descripcion: "Top corto y entallado de manga corta, para tejidos de punto con elasticidad." },
    { id: "camisa-yala", nombre: "Camisa Yala", categoria: "descanso", silueta: "camisa", precio: 19000,
      nivel: "intermedio", consumo: 1.5, tejidos: ["popelina", "franela"],
      piezas: ["delantero", "espalda", "mangaCorta", "cuello", "bolsillo"],
      descripcion: "Camisa de descanso con cuello solapa y ribete en contraste. Combina con el Pantalón Yala." },
    { id: "pantalon-yala", nombre: "Pantalón Yala", categoria: "descanso", silueta: "pantalon", precio: 17000,
      nivel: "basico", consumo: 1.6, tejidos: ["popelina", "franela"],
      piezas: ["piernaDel", "piernaTras", "pretina"],
      descripcion: "Pantalón holgado de descanso con cintura elastizada y cordón." },
  ],
};
