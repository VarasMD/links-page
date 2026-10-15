// Catálogo de la tienda. Editá este archivo para cambiar productos, precios y datos de contacto.
window.TIENDA = {
  config: {
    // Número con código de país, sin "+" ni espacios. Ej: "5491112345678". Vacío = pedido por WhatsApp deshabilitado.
    whatsapp: "",
  },

  categorias: [
    { id: "remeras", label: "Remeras" },
    { id: "buzos", label: "Buzos" },
    { id: "camperas", label: "Camperas" },
    { id: "camisas", label: "Camisas" },
    { id: "pantalones", label: "Pantalones" },
    { id: "pijamas", label: "Pijamas" },
  ],

  talles: ["S", "M", "L", "XL", "XXL", "XXXL"],

  // Curvas: varios talles en un mismo pedido, con precio por factor sobre el talle individual.
  curvas: [
    { id: "curva-base", label: "Curva base", detalle: "S · M · L", cantidad: 3, factor: 2.2 },
    { id: "curva-completa", label: "Curva completa", detalle: "S a XXXL", cantidad: 6, factor: 3.5 },
  ],

  // `extra` se suma por cada talle incluido.
  formatos: [
    { id: "pdf", label: "Digital", detalle: "PDF para imprimir", extra: 0 },
    { id: "papel", label: "Impreso", detalle: "Escala 1:1 en papel", extra: 4000 },
  ],

  info: [
    { titulo: "Tiempo de entrega", texto: "Digital: lo recibís por email al confirmar el pago. Impreso: entre 2 y 7 días hábiles, con código de seguimiento." },
    { titulo: "Retiro por el estudio", texto: "Coordinamos día y horario por email una vez recibido el pago." },
    { titulo: "Términos de uso", texto: "Uso exclusivo para producción propia. No está permitida la reventa ni la distribución del molde." },
    { titulo: "Devoluciones", texto: "Aceptamos reclamos por fallas de impresión dentro de las 48 hs. No se aceptan devoluciones por errores en la decisión de compra." },
  ],

  // silueta: remera | buzo | campera | camisa | pantalon | short
  productos: [
    { id: "buzo-boxy", nombre: "Buzo Boxy", categoria: "buzos", silueta: "buzo", precio: 24000, nuevo: true,
      descripcion: "Buzo de calce amplio y hombro caído, con puños y cintura en rib. Ideal para frisa o french terry." },
    { id: "baby-tee", nombre: "Baby Tee", categoria: "remeras", silueta: "remera", precio: 16000, nuevo: true,
      descripcion: "Remera corta y entallada de manga corta. Pensada para tejidos de punto con elasticidad." },
    { id: "coach-jacket", nombre: "Coach Jacket", categoria: "camperas", silueta: "campera", precio: 28000,
      descripcion: "Campera liviana con botones a presión, cuello camisero y cordón de ajuste en la cintura." },
    { id: "jogging-baggy", nombre: "Jogging Baggy", categoria: "pantalones", silueta: "pantalon", precio: 24000,
      descripcion: "Pantalón jogging de pierna ancha con cintura elastizada, bolsillos laterales y puño opcional." },
    { id: "camisa-lenadora", nombre: "Camisa Leñadora", categoria: "camisas", silueta: "camisa", precio: 26000,
      descripcion: "Camisa de calce recto con bolsillos parche en el pecho, canesú y puños con botón." },
    { id: "remera-boxy", nombre: "Remera Boxy", categoria: "remeras", silueta: "remera", precio: 18000,
      descripcion: "Remera de silueta cuadrada y hombro caído, cuello a la base. Para jersey de algodón pesado." },
    { id: "pantalon-recto", nombre: "Pantalón Recto", categoria: "pantalones", silueta: "pantalon", precio: 22000,
      descripcion: "Pantalón de pierna recta con pretina, bragueta con cierre y bolsillos delanteros y traseros." },
    { id: "buzo-zip", nombre: "Buzo Zip", categoria: "buzos", silueta: "campera", precio: 26000,
      descripcion: "Buzo con cierre frontal completo, cuello alto y bolsillos canguro divididos." },
    { id: "boardshort", nombre: "Boardshort", categoria: "pantalones", silueta: "short", precio: 24000,
      descripcion: "Traje de baño estilo surf con cintura regulable y un bolsillo lateral." },
    { id: "remera-ranglan", nombre: "Remera Ranglan", categoria: "remeras", silueta: "remera", precio: 18000,
      descripcion: "Remera con manga ranglan y cuello redondo, de calce regular." },
    { id: "pantalon-pijama", nombre: "Pantalón Pijama", categoria: "pijamas", silueta: "pantalon", precio: 18000,
      descripcion: "Pantalón holgado con cintura elastizada y cordón. Para tejido plano o punto." },
    { id: "top-pijama", nombre: "Top Pijama", categoria: "pijamas", silueta: "camisa", precio: 18000,
      descripcion: "Camisa de pijama con cuello solapa, ribete en contraste y bolsillo en el pecho." },
  ],
};
