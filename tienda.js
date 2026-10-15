(() => {
  const { config, categorias, niveles, tejidos, talles, descuentos, formatos, info, productos } = window.TIENDA;

  const $ = (sel) => document.querySelector(sel);
  const dinero = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const metros = (n) => `${n.toLocaleString("es-AR", { maximumFractionDigits: 1 })} m`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const redondear = (n) => Math.round(n / 100) * 100;
  const porId = (lista, id) => lista.find((x) => x.id === id);
  const catLabel = (id) => porId(categorias, id)?.label ?? id;
  const TALLE_IDS = talles.map((t) => t.id);
  const ordenarTalles = (ids) => TALLE_IDS.filter((t) => ids.includes(t));

  /* ---------- Precios ---------- */

  const descuento = (n) => descuentos.filter((d) => n >= d.desde).reduce((pct, d) => Math.max(pct, d.pct), 0);

  function cotizar(producto, tallesSel, formatoId) {
    const lista = (producto.precio + porId(formatos, formatoId).extra) * tallesSel.length;
    const pct = descuento(tallesSel.length);
    return { lista, pct, total: redondear(lista * (1 - pct / 100)) };
  }

  /* ---------- Dibujos: prenda y despiece ---------- */

  const SILUETAS = {
    remera: `<path d="M40 22l12-4q8 8 16 0l12 4 18 16-10 10-8-6v58H40V42l-8 6-10-10z"/><path class="seam" d="M44 94h32"/>`,
    buzo: `<path d="M40 20l12-4q8 8 16 0l12 4 20 40-10 4-10-20v54H40V44L30 64l-10-4z"/><path class="seam" d="M40 90h40M86 58l8-3M34 58l-8-3"/>`,
    campera: `<path d="M40 20l12-4q8 8 16 0l12 4 20 40-10 4-10-20v54H40V44L30 64l-10-4z"/><path class="seam" d="M60 24v74M40 90h40M46 70h8M66 70h8"/>`,
    camisa: `<path d="M40 20l12-4q8 8 16 0l12 4 20 40-10 4-10-20v54H40V44L30 64l-10-4z"/><path class="seam" d="M52 16l8 12 8-12M60 30v68"/><circle class="dot" cx="60" cy="44" r="1.4"/><circle class="dot" cx="60" cy="60" r="1.4"/><circle class="dot" cx="60" cy="76" r="1.4"/>`,
    pantalon: `<path d="M38 16h44l6 88H68l-8-58-8 58H32z"/><path class="seam" d="M37 24h46M48 24l2 12M72 24l-2 12"/>`,
    short: `<path d="M36 30h48l6 48-24 2-6-24-6 24-24-2z"/><path class="seam" d="M35 38h50M33 70l20 2M87 70l-20 2"/>`,
  };

  // Piezas del molde, dibujadas en una caja de 40×40.
  const PIEZAS = {
    delantero: { label: "Delantero", d: "M6 5l8-3q6 9 12 0l8 3 2 33H4z" },
    espalda: { label: "Espalda", d: "M6 5l8-3q6 3 12 0l8 3 2 33H4z" },
    mangaCorta: { label: "Manga", d: "M3 16Q20 1 37 16l-4 14H7z" },
    mangaLarga: { label: "Manga", d: "M7 8Q20 0 33 8l-3 30H10z" },
    puno: { label: "Puño", d: "M4 15h32v10H4z" },
    cintura: { label: "Cintura", d: "M2 16h36v8H2z" },
    cuelloRib: { label: "Cuello", d: "M3 17h34v6H3z" },
    cuello: { label: "Cuello", d: "M3 20Q20 10 37 20v6Q20 16 3 26z" },
    capucha: { label: "Capucha", d: "M8 38Q4 4 24 3q12 3 10 35z" },
    bolsillo: { label: "Bolsillo", d: "M9 8h22v20l-11 5-11-5z" },
    tiraCierre: { label: "Tira", d: "M16 2h8v36h-8z" },
    canesu: { label: "Canesú", d: "M3 12h34l-3 14H6z" },
    pretina: { label: "Pretina", d: "M2 16h36v8H2z" },
    piernaDel: { label: "Del. pierna", d: "M10 2h20l5 36H18l-2-26-4 0z" },
    piernaTras: { label: "Tras. pierna", d: "M7 2h24l5 36H18l-3-24-8-2z" },
  };

  const TONOS = ["#efe2d3", "#e8d4c1", "#f2e8dc", "#e5d3c0", "#ecdacb", "#e9dccd"];
  const tono = (p) => TONOS[productos.indexOf(p) % TONOS.length];

  function prendaSVG(p) {
    return `<svg class="art silueta" viewBox="-14 -14 148 148" role="img" aria-label="Prenda: ${esc(p.nombre)}" style="background-color:${tono(p)}">${SILUETAS[p.silueta] ?? SILUETAS.remera}</svg>`;
  }

  function despieceSVG(p) {
    const n = p.piezas.length;
    const cols = n <= 4 ? 2 : 3;
    const filas = Math.ceil(n / cols);
    const celda = 120 / Math.max(cols, filas);
    const ox = (120 - cols * celda) / 2;
    const oy = (120 - filas * celda) / 2;
    const escala = (celda * 0.8) / 40;
    const piezas = p.piezas.map((id, k) => {
      const pieza = PIEZAS[id];
      const x = ox + (k % cols) * celda;
      const y = oy + Math.floor(k / cols) * celda;
      return `<g transform="translate(${x + celda * 0.1} ${y + celda * 0.02}) scale(${escala})">
          <path class="piece" d="${pieza.d}"/>
          <path class="grain" d="M20 12v16M17.5 14.5L20 12l2.5 2.5M17.5 25.5L20 28l2.5-2.5"/>
        </g>
        <text class="piece-label" x="${x + celda / 2}" y="${y + celda * 0.94}" font-size="${(celda * 0.095).toFixed(2)}">${esc(pieza.label)}</text>`;
    }).join("");
    return `<svg class="art despiece" viewBox="-6 -6 132 132" role="img" aria-label="Piezas del molde: ${n}" style="background-color:${tono(p)}">${piezas}</svg>`;
  }

  const nivelHTML = (id) => {
    const nv = porId(niveles, id);
    const dots = niveles.map((x) => `<i class="${x.n <= nv.n ? "on" : ""}"></i>`).join("");
    return `<span class="level" title="Nivel ${esc(nv.label)}"><span class="dots" aria-hidden="true">${dots}</span>${esc(nv.label)}</span>`;
  };

  /* ---------- Catálogo y filtros ---------- */

  const estado = { categoria: "todos", busqueda: "", orden: "destacados", nivel: "todos", tejido: "todos" };
  const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function renderCategorias() {
    const chips = [{ id: "todos", label: "Todos", n: productos.length }]
      .concat(categorias.map((c) => ({ ...c, n: productos.filter((p) => p.categoria === c.id).length })))
      .filter((c) => c.n > 0);
    $("#categorias").innerHTML = chips
      .map((c) => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === estado.categoria}">${esc(c.label)} <span>${c.n}</span></button>`)
      .join("");
    $("#niveles").innerHTML = [{ id: "todos", label: "Todos los niveles" }].concat(niveles)
      .map((nv) => `<button type="button" data-nivel="${nv.id}" aria-pressed="${nv.id === estado.nivel}">${esc(nv.label)}</button>`)
      .join("");
  }

  function renderTejidos() {
    const usados = Object.keys(tejidos).filter((t) => productos.some((p) => p.tejidos.includes(t)));
    $("#tejido").innerHTML = `<option value="todos">cualquier tela</option>` +
      usados.map((t) => `<option value="${t}">${esc(tejidos[t].toLowerCase())}</option>`).join("");
  }

  function filtrados() {
    const q = normalizar(estado.busqueda.trim());
    const lista = productos
      .filter((p) => estado.categoria === "todos" || p.categoria === estado.categoria)
      .filter((p) => estado.nivel === "todos" || p.nivel === estado.nivel)
      .filter((p) => estado.tejido === "todos" || p.tejidos.includes(estado.tejido))
      .filter((p) => !q || normalizar(`${p.nombre} ${catLabel(p.categoria)} ${p.descripcion} ${p.tejidos.map((t) => tejidos[t]).join(" ")}`).includes(q));
    const nivelN = (p) => porId(niveles, p.nivel).n;
    const orden = {
      "precio-asc": (a, b) => a.precio - b.precio,
      "precio-desc": (a, b) => b.precio - a.precio,
      nivel: (a, b) => nivelN(a) - nivelN(b) || a.piezas.length - b.piezas.length,
      tela: (a, b) => a.consumo - b.consumo,
    }[estado.orden];
    return orden ? [...lista].sort(orden) : lista;
  }

  function renderGrid() {
    const lista = filtrados();
    $("#grid").innerHTML = lista
      .map((p) => `
        <article class="card">
          <div class="card-media">
            <div class="flip">
              <div class="face face-front">${prendaSVG(p)}</div>
              <div class="face face-back">${despieceSVG(p)}</div>
            </div>
            ${p.nuevo ? '<span class="badge">Nuevo</span>' : ""}
            <button type="button" class="flip-btn" aria-pressed="false" aria-label="Ver las piezas de ${esc(p.nombre)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 13h7v7h-7zM13 4h7v7h-7zM4 13h7v7H4z"/></svg>
              <span>${p.piezas.length} piezas</span>
            </button>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>${esc(catLabel(p.categoria))}</span>${nivelHTML(p.nivel)}</div>
            <h3><a class="card-link" href="#${p.id}">${esc(p.nombre)}</a></h3>
            <p class="card-tela">${p.tejidos.map((t) => esc(tejidos[t])).join(" · ")} · ${metros(p.consumo)}</p>
            <p class="card-price">${dinero.format(p.precio)} <span>por talle</span></p>
          </div>
        </article>`)
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
  $("#niveles").addEventListener("click", (e) => {
    const b = e.target.closest("[data-nivel]");
    if (!b) return;
    estado.nivel = b.dataset.nivel;
    renderCategorias();
    renderGrid();
  });
  $("#tejido").addEventListener("change", (e) => { estado.tejido = e.target.value; renderGrid(); });
  $("#buscar").addEventListener("input", (e) => { estado.busqueda = e.target.value; renderGrid(); });
  $("#ordenar").addEventListener("change", (e) => { estado.orden = e.target.value; renderGrid(); });
  $("#limpiar").addEventListener("click", () => {
    Object.assign(estado, { categoria: "todos", busqueda: "", nivel: "todos", tejido: "todos" });
    $("#buscar").value = "";
    $("#tejido").value = "todos";
    renderCategorias();
    renderGrid();
  });

  // Dar vuelta la tarjeta (en pantallas táctiles; con mouse también lo hace el hover).
  $("#grid").addEventListener("click", (e) => {
    const b = e.target.closest(".flip-btn");
    if (!b) return;
    const girada = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", girada);
    b.closest(".card").classList.toggle("is-flipped", girada);
  });

  /* ---------- Vista de producto (deep link: tienda.html#<id>) ---------- */

  const modal = $("#producto");
  const sel = { id: null, talles: ["M"], formato: formatos[0].id, vista: "prenda", calc: {} };
  const actual = () => porId(productos, sel.id);

  function renderMedia() {
    const p = actual();
    $("#p-media").innerHTML = sel.vista === "piezas" ? despieceSVG(p) : prendaSVG(p);
    modal.querySelectorAll("[data-vista]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.vista === sel.vista));
  }

  function renderOpciones() {
    const p = actual();
    $("#p-formatos").innerHTML = formatos
      .map((f) => `<button type="button" data-formato="${f.id}" aria-pressed="${f.id === sel.formato}"><strong>${esc(f.label)}</strong><span>${esc(f.detalle)}</span></button>`)
      .join("");
    $("#p-talles").innerHTML = TALLE_IDS
      .map((t) => `<button type="button" data-talle="${t}" aria-pressed="${sel.talles.includes(t)}">${t}</button>`)
      .join("");
    $("#p-todos").textContent = sel.talles.length === TALLE_IDS.length ? "Quitar todos" : "Elegir todos";

    const n = sel.talles.length;
    const c = cotizar(p, sel.talles, sel.formato);
    $("#p-precio").textContent = n ? dinero.format(c.total) : "Elegí al menos un talle";
    $("#p-precio-old").textContent = c.pct ? dinero.format(c.lista) : "";

    const proximo = descuentos.find((d) => d.desde > n);
    const promo = $("#p-promo");
    if (c.pct && !proximo) promo.innerHTML = `<b>${c.pct}% off</b> aplicado por llevar ${n} talles.`;
    else if (c.pct) promo.innerHTML = `<b>${c.pct}% off</b> aplicado. Con ${proximo.desde} talles pasa a ${proximo.pct}%.`;
    else if (proximo) promo.textContent = `Sumá ${proximo.desde - n} ${proximo.desde - n === 1 ? "talle" : "talles"} más y llevás ${proximo.pct}% off.`;
    else promo.textContent = "";

    $("#p-agregar").disabled = n === 0;
  }

  function renderCalc() {
    const p = actual();
    const pedidos = TALLE_IDS.filter((t) => sel.calc[t] > 0);
    const prendas = pedidos.reduce((s, t) => s + sel.calc[t], 0);
    const out = $("#calc-out");
    $("#calc-usar").disabled = prendas === 0;
    if (!prendas) {
      out.innerHTML = `<span class="muted">Consumo de referencia: ${metros(p.consumo)} por prenda talle M.</span>`;
      return;
    }
    const tela = pedidos.reduce((s, t) => s + sel.calc[t] * p.consumo * porId(talles, t).consumo, 0) * (1 + config.merma);
    const c = cotizar(p, pedidos, sel.formato);
    out.innerHTML = `
      <div><strong>${metros(Math.ceil(tela * 10) / 10)}</strong><span>de tela (ancho ${metros(config.anchoTela)}, +${Math.round(config.merma * 100)}% de merma)</span></div>
      <div><strong>${prendas}</strong><span>${prendas === 1 ? "prenda" : "prendas"} en ${pedidos.length} ${pedidos.length === 1 ? "talle" : "talles"}</span></div>
      <div><strong>${dinero.format(c.total)}</strong><span>molde para esos talles${c.pct ? ` (${c.pct}% off)` : ""}</span></div>`;
  }

  function abrirProducto(id) {
    const p = porId(productos, id);
    if (!p) return;
    Object.assign(sel, { id, talles: ["M"], formato: formatos[0].id, vista: "prenda", calc: {} });
    $("#p-categoria").textContent = catLabel(p.categoria);
    $("#p-nombre").textContent = p.nombre;
    $("#p-desc").textContent = p.descripcion;
    $("#p-specs").innerHTML = `
      <div><dt>Nivel</dt><dd>${nivelHTML(p.nivel)}</dd></div>
      <div><dt>Piezas</dt><dd>${p.piezas.length}</dd></div>
      <div><dt>Telas sugeridas</dt><dd>${p.tejidos.map((t) => esc(tejidos[t])).join(", ")}</dd></div>
      <div><dt>Consumo</dt><dd>${metros(p.consumo)} <small>talle M</small></dd></div>`;
    $("#calc-inputs").innerHTML = TALLE_IDS
      .map((t) => `<label><span>${t}</span><input type="number" min="0" max="9999" step="1" inputmode="numeric" placeholder="0" data-calc="${t}"></label>`)
      .join("");
    $("#p-info").innerHTML = info
      .map((d) => `<details><summary>${esc(d.titulo)}</summary><p>${esc(d.texto)}</p></details>`)
      .join("");
    renderMedia();
    renderOpciones();
    renderCalc();
    document.title = `${p.nombre} · Moldes listos`;
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
  }

  function rutaActual() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && porId(productos, id)) abrirProducto(id);
    else if (modal.open) modal.close();
  }

  modal.addEventListener("click", (e) => {
    const f = e.target.closest("[data-formato]");
    const t = e.target.closest("[data-talle]");
    const v = e.target.closest("[data-vista]");
    if (f) { sel.formato = f.dataset.formato; renderOpciones(); renderCalc(); }
    if (t) {
      const id = t.dataset.talle;
      sel.talles = sel.talles.includes(id) ? sel.talles.filter((x) => x !== id) : ordenarTalles([...sel.talles, id]);
      renderOpciones();
    }
    if (v) { sel.vista = v.dataset.vista; renderMedia(); }
  });
  $("#p-todos").addEventListener("click", () => {
    sel.talles = sel.talles.length === TALLE_IDS.length ? [] : [...TALLE_IDS];
    renderOpciones();
  });
  $("#calc-inputs").addEventListener("input", (e) => {
    const inp = e.target.closest("[data-calc]");
    if (!inp) return;
    sel.calc[inp.dataset.calc] = Math.max(0, Math.floor(Number(inp.value) || 0));
    renderCalc();
  });
  $("#calc-usar").addEventListener("click", () => {
    sel.talles = TALLE_IDS.filter((t) => sel.calc[t] > 0);
    renderOpciones();
    $("#p-talles").scrollIntoView({ behavior: "smooth", block: "center" });
    aviso(`Elegimos ${sel.talles.join(", ")} para tu pedido`);
  });
  modal.addEventListener("close", () => {
    document.title = "Moldes listos · Estudio";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  });
  window.addEventListener("hashchange", rutaActual);

  /* ---------- Pedido (persistido en el navegador) ---------- */

  const CLAVE = "tienda-pedido";
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { carrito = []; }
  carrito = carrito.filter((it) =>
    porId(productos, it.id) && porId(formatos, it.formato) &&
    Array.isArray(it.talles) && it.talles.length && it.talles.every((t) => TALLE_IDS.includes(t)));

  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch { /* sin storage: el pedido vive en memoria */ } };
  const subtotal = (it) => cotizar(porId(productos, it.id), it.talles, it.formato).total;
  const tallesTexto = (ids) => (ids.length === TALLE_IDS.length ? "Todos los talles" : `Talle${ids.length > 1 ? "s" : ""} ${ids.join(", ")}`);

  function renderCarrito() {
    const total = carrito.reduce((s, it) => s + subtotal(it), 0);
    const badge = $("#cart-count");
    badge.textContent = carrito.length;
    badge.hidden = carrito.length === 0;

    $("#c-items").innerHTML = carrito
      .map((it, idx) => {
        const p = porId(productos, it.id);
        const pct = descuento(it.talles.length);
        return `
          <li class="cart-item">
            <div class="cart-thumb">${prendaSVG(p)}</div>
            <div class="cart-text">
              <strong>${esc(p.nombre)}</strong>
              <span>${esc(tallesTexto(it.talles))} · ${esc(porId(formatos, it.formato).label)}${pct ? ` · ${pct}% off` : ""}</span>
              <div class="cart-sizes">
                ${it.talles.map((t) => `<button type="button" data-item="${idx}" data-sacar="${t}" aria-label="Quitar talle ${t}">${t} <span aria-hidden="true">×</span></button>`).join("")}
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
        return `• ${p.nombre} — ${tallesTexto(it.talles)} — ${porId(formatos, it.formato).label}: ${dinero.format(subtotal(it))}`;
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
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  $("#p-agregar").addEventListener("click", () => {
    if (!sel.talles.length) return;
    // Un molde aparece una sola vez por formato: si ya estaba, se suman los talles nuevos.
    const existente = carrito.find((it) => it.id === sel.id && it.formato === sel.formato);
    if (existente) existente.talles = ordenarTalles([...new Set([...existente.talles, ...sel.talles])]);
    else carrito.push({ id: sel.id, talles: [...sel.talles], formato: sel.formato });
    guardar();
    renderCarrito();
    modal.close();
    aviso(existente ? `Actualizamos los talles de ${actual().nombre}` : `${actual().nombre} agregado al pedido`);
  });

  const sheet = $("#carrito");
  $("#abrir-carrito").addEventListener("click", () => sheet.showModal());
  sheet.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.sacar) {
      const it = carrito[b.dataset.item];
      it.talles = it.talles.filter((t) => t !== b.dataset.sacar);
      if (!it.talles.length) carrito.splice(b.dataset.item, 1);
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
  renderTejidos();
  renderGrid();
  renderCarrito();
  rutaActual();
})();
