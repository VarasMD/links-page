(() => {
  const { config, categorias, talles, curvas, formatos, info, productos } = window.TIENDA;

  const $ = (sel) => document.querySelector(sel);
  const dinero = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const redondear = (n) => Math.round(n / 500) * 500;
  const porId = (lista, id) => lista.find((x) => x.id === id);
  const catLabel = (id) => porId(categorias, id)?.label ?? id;

  /* ---------- Precios ---------- */

  // Opción de talle: un talle suelto o una curva.
  function opcion(producto, talleId) {
    const curva = porId(curvas, talleId);
    if (curva) return { label: `${curva.label} (${curva.detalle})`, cantidad: curva.cantidad, precio: redondear(producto.precio * curva.factor) };
    return { label: `Talle ${talleId}`, cantidad: 1, precio: producto.precio };
  }

  function precio(producto, talleId, formatoId) {
    const op = opcion(producto, talleId);
    const formato = porId(formatos, formatoId);
    return op.precio + formato.extra * op.cantidad;
  }

  /* ---------- Siluetas (placeholder hasta tener fotos) ---------- */

  const SILUETAS = {
    remera: `<path d="M40 22l12-4q8 8 16 0l12 4 18 16-10 10-8-6v58H40V42l-8 6-10-10z"/><path class="seam" d="M44 94h32"/>`,
    buzo: `<path d="M40 20l12-4q8 8 16 0l12 4 20 40-10 4-10-20v54H40V44L30 64l-10-4z"/><path class="seam" d="M40 90h40M86 58l8-3M34 58l-8-3"/>`,
    campera: `<path d="M40 20l12-4q8 8 16 0l12 4 20 40-10 4-10-20v54H40V44L30 64l-10-4z"/><path class="seam" d="M60 24v74M40 90h40M46 70h8M66 70h8"/>`,
    camisa: `<path d="M40 20l12-4q8 8 16 0l12 4 20 40-10 4-10-20v54H40V44L30 64l-10-4z"/><path class="seam" d="M52 16l8 12 8-12M60 30v68"/><circle class="dot" cx="60" cy="44" r="1.4"/><circle class="dot" cx="60" cy="60" r="1.4"/><circle class="dot" cx="60" cy="76" r="1.4"/>`,
    pantalon: `<path d="M38 16h44l6 88H68l-8-58-8 58H32z"/><path class="seam" d="M37 24h46M48 24l2 12M72 24l-2 12"/>`,
    short: `<path d="M36 30h48l6 48-24 2-6-24-6 24-24-2z"/><path class="seam" d="M35 38h50M33 70l20 2M87 70l-20 2"/>`,
  };
  const TONOS = ["#efe2d3", "#e8d4c1", "#f2e8dc", "#e5d3c0", "#ecdacb", "#e9dccd"];

  function figura(p, i) {
    const tono = TONOS[i % TONOS.length];
    return `<svg class="silueta" viewBox="-14 -14 148 148" role="img" aria-label="Molde ${esc(p.nombre)}" style="background:${tono}">${SILUETAS[p.silueta] ?? SILUETAS.remera}</svg>`;
  }

  /* ---------- Catálogo ---------- */

  const estado = { categoria: "todos", busqueda: "", orden: "destacados" };
  const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function renderCategorias() {
    const chips = [{ id: "todos", label: "Todos", n: productos.length }]
      .concat(categorias.map((c) => ({ ...c, n: productos.filter((p) => p.categoria === c.id).length })))
      .filter((c) => c.n > 0);
    $("#categorias").innerHTML = chips
      .map((c) => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === estado.categoria}">${esc(c.label)} <span>${c.n}</span></button>`)
      .join("");
  }

  function filtrados() {
    const q = normalizar(estado.busqueda.trim());
    const lista = productos
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => estado.categoria === "todos" || p.categoria === estado.categoria)
      .filter(({ p }) => !q || normalizar(`${p.nombre} ${catLabel(p.categoria)} ${p.descripcion}`).includes(q));
    const orden = {
      "precio-asc": (a, b) => a.p.precio - b.p.precio,
      "precio-desc": (a, b) => b.p.precio - a.p.precio,
      nombre: (a, b) => a.p.nombre.localeCompare(b.p.nombre, "es"),
    }[estado.orden];
    return orden ? lista.sort(orden) : lista;
  }

  function renderGrid() {
    const lista = filtrados();
    $("#grid").innerHTML = lista
      .map(({ p, i }) => `
        <a class="card" href="#${p.id}">
          <div class="card-media">
            ${figura(p, i)}
            ${p.nuevo ? '<span class="badge">Nuevo</span>' : ""}
          </div>
          <div class="card-body">
            <p class="card-cat">${esc(catLabel(p.categoria))}</p>
            <h3>${esc(p.nombre)}</h3>
            <p class="card-price">desde ${dinero.format(p.precio)}</p>
          </div>
        </a>`)
      .join("");
    $("#vacio").hidden = lista.length > 0;
    $("#resultado").textContent = `${lista.length} ${lista.length === 1 ? "molde" : "moldes"}`;
  }

  $("#categorias").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cat]");
    if (!chip) return;
    estado.categoria = chip.dataset.cat;
    renderCategorias();
    renderGrid();
  });
  $("#buscar").addEventListener("input", (e) => { estado.busqueda = e.target.value; renderGrid(); });
  $("#ordenar").addEventListener("change", (e) => { estado.orden = e.target.value; renderGrid(); });
  $("#limpiar").addEventListener("click", () => {
    Object.assign(estado, { categoria: "todos", busqueda: "" });
    $("#buscar").value = "";
    renderCategorias();
    renderGrid();
  });

  /* ---------- Vista de producto (deep link: tienda.html#<id>) ---------- */

  const modal = $("#producto");
  const sel = { id: null, talle: "M", formato: formatos[0].id };

  function renderOpciones() {
    const p = porId(productos, sel.id);
    $("#p-formatos").innerHTML = formatos
      .map((f) => `<button type="button" data-formato="${f.id}" aria-pressed="${f.id === sel.formato}"><strong>${esc(f.label)}</strong><span>${esc(f.detalle)}</span></button>`)
      .join("");
    $("#p-talles").innerHTML = talles
      .map((t) => `<button type="button" data-talle="${t}" aria-pressed="${t === sel.talle}">${t}</button>`)
      .join("");
    $("#p-curvas").innerHTML = curvas
      .map((c) => `<button type="button" data-talle="${c.id}" aria-pressed="${c.id === sel.talle}"><strong>${esc(c.label)}</strong><span>${esc(c.detalle)}</span></button>`)
      .join("");
    $("#p-precio").textContent = dinero.format(precio(p, sel.talle, sel.formato));
  }

  function abrirProducto(id) {
    const i = productos.findIndex((p) => p.id === id);
    if (i < 0) return;
    const p = productos[i];
    Object.assign(sel, { id, talle: "M", formato: formatos[0].id });
    $("#p-media").innerHTML = figura(p, i);
    $("#p-categoria").textContent = catLabel(p.categoria);
    $("#p-nombre").textContent = p.nombre;
    $("#p-desc").textContent = p.descripcion;
    $("#p-info").innerHTML = [{ titulo: "Qué incluye", texto: "Molde por talle con márgenes de costura, tabla de medidas y ficha técnica con avíos aplicados." }]
      .concat(info)
      .map((d) => `<details><summary>${esc(d.titulo)}</summary><p>${esc(d.texto)}</p></details>`)
      .join("");
    renderOpciones();
    document.title = `${p.nombre} · Moldes listos`;
    if (!modal.open) modal.showModal();
  }

  function rutaActual() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && porId(productos, id)) abrirProducto(id);
    else if (modal.open) modal.close();
  }

  modal.addEventListener("click", (e) => {
    const f = e.target.closest("[data-formato]");
    const t = e.target.closest("[data-talle]");
    if (f) { sel.formato = f.dataset.formato; renderOpciones(); }
    if (t) { sel.talle = t.dataset.talle; renderOpciones(); }
  });
  modal.addEventListener("close", () => {
    document.title = "Moldes listos · Estudio";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  });
  window.addEventListener("hashchange", rutaActual);

  /* ---------- Carrito (persistido en el navegador) ---------- */

  const CLAVE = "tienda-carrito";
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { carrito = []; }
  carrito = carrito.filter((it) => porId(productos, it.id) && (talles.includes(it.talle) || porId(curvas, it.talle)) && porId(formatos, it.formato));

  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch { /* sin storage: el carrito vive en memoria */ } };
  const subtotal = (it) => precio(porId(productos, it.id), it.talle, it.formato) * it.cant;

  function renderCarrito() {
    const total = carrito.reduce((s, it) => s + subtotal(it), 0);
    const unidades = carrito.reduce((s, it) => s + it.cant, 0);
    const badge = $("#cart-count");
    badge.textContent = unidades;
    badge.hidden = unidades === 0;

    $("#c-items").innerHTML = carrito
      .map((it, idx) => {
        const p = porId(productos, it.id);
        return `
          <li class="cart-item">
            <div class="cart-thumb">${figura(p, productos.indexOf(p))}</div>
            <div class="cart-text">
              <strong>${esc(p.nombre)}</strong>
              <span>${esc(opcion(p, it.talle).label)} · ${esc(porId(formatos, it.formato).label)}</span>
              <div class="qty">
                <button type="button" data-menos="${idx}" aria-label="Quitar uno">−</button>
                <span>${it.cant}</span>
                <button type="button" data-mas="${idx}" aria-label="Agregar uno">+</button>
              </div>
            </div>
            <div class="cart-side">
              <span>${dinero.format(subtotal(it))}</span>
              <button type="button" class="link-btn" data-quitar="${idx}">Quitar</button>
            </div>
          </li>`;
      })
      .join("");

    const vacio = carrito.length === 0;
    $("#c-vacio").hidden = !vacio;
    $("#c-pie").hidden = vacio;
    $("#c-total").textContent = dinero.format(total);

    const wa = $("#c-whatsapp");
    if (config.whatsapp) {
      const lineas = carrito.map((it) => {
        const p = porId(productos, it.id);
        return `• ${p.nombre} — ${opcion(p, it.talle).label} — ${porId(formatos, it.formato).label} x${it.cant}: ${dinero.format(subtotal(it))}`;
      });
      const msg = `¡Hola! Quiero hacer este pedido:\n${lineas.join("\n")}\n\nTotal: ${dinero.format(total)}`;
      wa.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`;
      wa.removeAttribute("aria-disabled");
      $("#c-hint").textContent = "Te respondemos con los datos de pago y envío.";
    } else {
      wa.removeAttribute("href");
      wa.setAttribute("aria-disabled", "true");
      $("#c-hint").textContent = "Falta configurar el número de WhatsApp en productos.js.";
    }
  }

  let toastTimer;
  function aviso(texto) {
    const t = $("#toast");
    t.textContent = texto;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  $("#p-agregar").addEventListener("click", () => {
    const existente = carrito.find((it) => it.id === sel.id && it.talle === sel.talle && it.formato === sel.formato);
    if (existente) existente.cant += 1;
    else carrito.push({ id: sel.id, talle: sel.talle, formato: sel.formato, cant: 1 });
    guardar();
    renderCarrito();
    modal.close();
    aviso(`${porId(productos, sel.id).nombre} agregado al carrito`);
  });

  const sheet = $("#carrito");
  $("#abrir-carrito").addEventListener("click", () => sheet.showModal());
  sheet.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.mas) carrito[b.dataset.mas].cant += 1;
    else if (b.dataset.menos) {
      const it = carrito[b.dataset.menos];
      it.cant -= 1;
      if (it.cant === 0) carrito.splice(b.dataset.menos, 1);
    } else if (b.dataset.quitar) carrito.splice(b.dataset.quitar, 1);
    else return;
    guardar();
    renderCarrito();
  });

  /* ---------- Cierre de diálogos (botón ✕ o click en el fondo) ---------- */

  for (const d of [modal, sheet]) {
    d.addEventListener("click", (e) => {
      if (e.target === d || e.target.closest("[data-cerrar]")) d.close();
    });
  }

  renderCategorias();
  renderGrid();
  renderCarrito();
  rutaActual();
})();
