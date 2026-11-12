/* ثيم «فحم» لمواقع المطاعم (OTT-0165، الجلسة 187): السلة، وتخصيص الصنف، والعناوين، وإتمام الطلب، وحسابي، والهيرو.
   الأسعار والإجمالي بتتحسب هنا بالكود من بيانات القائمة المعتمدة (window.BB) كل مرة، ومفيش سعر بيتخزّن ويترجع (القاعدة 0.2).
   كل البيانات على جهاز الزبون بس (localStorage)، وكل أكشن ليه إشعار (القاعدة 6.1)، ومفيش alert/confirm (القاعدة 6.4). */
(function () {
  "use strict";
  var BB = window.BB || { items: [], cats: [], addons: [], biz: {} };
  var doc = document, html = doc.documentElement;
  var LANG = html.lang === "en" ? "en" : "ar";
  var PRE = LANG === "ar" ? "/" : "/en/";
  var ITEMS = {}; BB.items.forEach(function (it) { ITEMS[it.id] = it; });

  var L = {
    ar: {
      cur: "ج.م", added: "تمت إضافة {n} إلى السلة", removed: "تم حذف {n} من السلة", qty: "تم تحديث الكمية",
      cartEmptyH: "سلتك فارغة", cartEmptyP: "أضف أصنافك المفضلة من القائمة وستظهر هنا.", browse: "تصفح القائمة",
      subtotal: "المجموع", checkout: "إتمام الطلب", remove: "حذف", size: "الحجم", chooseOne: "اختر واحدًا", required: "مطلوب",
      done: "تم", optional: "اختياري", addons: "إضافات وصوصات", addonsSub: "اختر ما تريد", notes: "ملاحظات على الصنف",
      notesPh: "مثال: بدون بصل", quantity: "الكمية", total: "الإجمالي", addToCart: "أضف إلى السلة", update: "تحديث السلة",
      soldOut: "غير متاح حاليًا", pickSize: "اختر الحجم أولًا", from: "من",
      deliverTo: "التوصيل إلى", addAddr: "أضف عنوانًا", pickupFrom: "الاستلام من", dineAt: "تناول الطعام في", restaurant: "المطعم",
      modeSet: "طريقة الطلب: {m}", delivery: "توصيل", pickup: "استلام من المطعم", dinein: "تناول في المطعم",
      pickupInfo: "سيؤكد لك المطعم موعد الاستلام عند تأكيد طلبك.",
      addrTitle: "عنوان التوصيل", savedAddrs: "عناوينك المحفوظة", orNew: "أو أضف عنوانًا جديدًا", addrLabel: "اسم العنوان",
      addrLabelPh: "المنزل، العمل…", area: "المنطقة", street: "الشارع", building: "رقم العقار", floor: "الدور", apt: "الشقة",
      landmark: "علامة مميزة", opt: "(اختياري)", saveAddr: "حفظ العنوان", useAddr: "استخدام هذا العنوان", cancel: "إلغاء",
      addrSaved: "تم حفظ العنوان", addrSelected: "تم اختيار العنوان", addrDeleted: "تم حذف العنوان", fieldReq: "هذا الحقل مطلوب",
      fixErrors: "لم يتم الحفظ: أكمل الحقول المطلوبة", home: "المنزل",
      coMode: "طريقة الاستلام", coContact: "بيانات التواصل", coAddr: "عنوان التوصيل", coNotes: "ملاحظات الطلب", coPay: "الدفع",
      name: "الاسم", phone: "رقم الموبايل", phonePh: "01xxxxxxxxx", phoneBad: "اكتب رقم موبايل مصري صحيح من 11 رقمًا يبدأ بـ 01",
      cash: "نقدًا عند الاستلام", coSummary: "ملخص الطلب", deliveryFee: "رسوم التوصيل", feeByArea: "يحددها المطعم حسب المنطقة",
      totalNoFee: "الإجمالي (بدون التوصيل)", totalAll: "الإجمالي", send: "إرسال الطلب عبر واتساب", editCart: "تعديل السلة",
      addNewAddr: "إضافة عنوان جديد", noAddr: "لا يوجد عنوان محفوظ بعد.", chooseAddr: "اختر عنوان التوصيل أو أضف عنوانًا",
      orderNotesPh: "أي تعليمات للمطعم أو للتوصيل", sendFail: "لم يتم الإرسال: أكمل البيانات المطلوبة",
      sentH: "تم تجهيز طلبك", sentP: "أرسل الرسالة في واتساب ليصل طلبك إلى المطعم، وسيتواصل معك لتأكيده ولتحديد رسوم التوصيل.",
      refNo: "رقم الطلب المرجعي", openWa: "فتح واتساب مرة أخرى", callInstead: "أو اتصل بنا", myOrders: "طلباتي",
      waNote: "إن لم يُفتح واتساب تلقائيًا فاضغط الزر بالأسفل.", orderSaved: "تم تجهيز الطلب {r} وفتح واتساب",
      msgHead: "طلب جديد من موقع {s}", msgNo: "رقم الطلب", msgMode: "الطريقة", msgName: "الاسم", msgPhone: "الهاتف", msgAddr: "العنوان",
      msgNotes: "ملاحظات", msgPay: "الدفع",
      accNote: "بيانات حسابك محفوظة على هذا الجهاز فقط ولا تُرسل إلى أي خادم.", tProfile: "الملف الشخصي", tAddrs: "العناوين",
      tOrders: "طلباتي", tData: "بياناتي", save: "حفظ", profileSaved: "تم حفظ بياناتك", noOrders: "لا توجد طلبات سابقة على هذا الجهاز.",
      reorder: "اطلب مرة أخرى", reordered: "تمت إضافة {n} صنف إلى السلة", reorderNone: "لم يتم: أصناف هذا الطلب غير متاحة الآن",
      edit: "تعديل", del: "حذف", makeDefault: "جعله الافتراضي", def: "الافتراضي", defSet: "تم جعله العنوان الافتراضي",
      dataP: "يمكنك حذف كل ما يحفظه الموقع على هذا الجهاز: السلة، والعناوين، وسجل الطلبات، وبياناتك.", wipe: "حذف بيانات هذا الجهاز",
      wipeConfirm: "اضغط مرة أخرى للتأكيد", wiped: "تم حذف كل بياناتك من هذا الجهاز", noStore: "لم يتم الحفظ: المتصفح يمنع التخزين المحلي",
      searchNone: "لا توجد نتائج", items: "أصناف", sent: "أُرسل عبر واتساب", sizeLbl: "الحجم"
    },
    en: {
      cur: "EGP", added: "{n} added to your cart", removed: "{n} removed from your cart", qty: "Quantity updated",
      cartEmptyH: "Your cart is empty", cartEmptyP: "Add your favourites from the menu and they will show up here.", browse: "Browse the menu",
      subtotal: "Subtotal", checkout: "Checkout", remove: "Remove", size: "Size", chooseOne: "Choose one", required: "Required",
      done: "Done", optional: "Optional", addons: "Sides & sauces", addonsSub: "Pick what you like", notes: "Notes for this item",
      notesPh: "e.g. no onions", quantity: "Quantity", total: "Total", addToCart: "Add to cart", update: "Update cart",
      soldOut: "Currently unavailable", pickSize: "Choose a size first", from: "From",
      deliverTo: "Deliver to", addAddr: "Add an address", pickupFrom: "Pick up from", dineAt: "Dine in at", restaurant: "the restaurant",
      modeSet: "Order type: {m}", delivery: "Delivery", pickup: "Pickup", dinein: "Dine-in",
      pickupInfo: "The restaurant will confirm your pickup time when it confirms your order.",
      addrTitle: "Delivery address", savedAddrs: "Your saved addresses", orNew: "or add a new address", addrLabel: "Address name",
      addrLabelPh: "Home, Work…", area: "Area", street: "Street", building: "Building no.", floor: "Floor", apt: "Apartment",
      landmark: "Landmark", opt: "(optional)", saveAddr: "Save address", useAddr: "Use this address", cancel: "Cancel",
      addrSaved: "Address saved", addrSelected: "Address selected", addrDeleted: "Address deleted", fieldReq: "This field is required",
      fixErrors: "Not saved: complete the required fields", home: "Home",
      coMode: "Order type", coContact: "Contact details", coAddr: "Delivery address", coNotes: "Order notes", coPay: "Payment",
      name: "Name", phone: "Mobile number", phonePh: "01xxxxxxxxx", phoneBad: "Enter a valid 11-digit Egyptian mobile number starting with 01",
      cash: "Cash on delivery", coSummary: "Order summary", deliveryFee: "Delivery fee", feeByArea: "Set by the restaurant per area",
      totalNoFee: "Total (excl. delivery)", totalAll: "Total", send: "Send order on WhatsApp", editCart: "Edit cart",
      addNewAddr: "Add a new address", noAddr: "No saved address yet.", chooseAddr: "Choose a delivery address or add one",
      orderNotesPh: "Any instructions for the restaurant or delivery", sendFail: "Not sent: complete the required details",
      sentH: "Your order is ready", sentP: "Send the message in WhatsApp so your order reaches the restaurant; they will contact you to confirm it and the delivery fee.",
      refNo: "Order reference", openWa: "Open WhatsApp again", callInstead: "or call us", myOrders: "My orders",
      waNote: "If WhatsApp did not open automatically, tap the button below.", orderSaved: "Order {r} prepared and WhatsApp opened",
      msgHead: "New order from the {s} website", msgNo: "Order no.", msgMode: "Type", msgName: "Name", msgPhone: "Phone", msgAddr: "Address",
      msgNotes: "Notes", msgPay: "Payment",
      accNote: "Your account data is stored on this device only and is never sent to any server.", tProfile: "Profile", tAddrs: "Addresses",
      tOrders: "My orders", tData: "My data", save: "Save", profileSaved: "Your details were saved", noOrders: "No previous orders on this device.",
      reorder: "Order again", reordered: "{n} item(s) added to your cart", reorderNone: "Not added: the items in this order are not available now",
      edit: "Edit", del: "Delete", makeDefault: "Make default", def: "Default", defSet: "Set as default address",
      dataP: "You can delete everything this website stores on this device: your cart, addresses, order history and details.", wipe: "Delete this device data",
      wipeConfirm: "Tap again to confirm", wiped: "All your data was deleted from this device", noStore: "Not saved: your browser blocks local storage",
      searchNone: "No results", items: "items", sent: "Sent on WhatsApp", sizeLbl: "Size"
    }
  }[LANG];
  function t(k, v) { var s = L[k] || k; if (v) Object.keys(v).forEach(function (x) { s = s.replace("{" + x + "}", v[x]); }); return s; }

  // ── أدوات ──
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(p) { var v = p % 100 === 0 ? p / 100 : (p / 100).toFixed(2); return LANG === "ar" ? v + " " + L.cur : L.cur + " " + v; }
  var ICON = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
    warn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    bike: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M10 9l-1-3H7"/></svg>',
    store: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v10h16V10M3 10l2-6h14l2 6M9 20v-6h6v6"/></svg>',
    seat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v9h12M6 13l-1 7M18 13l1 7M6 9h9"/></svg>',
    cash: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.2L4 20z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>'
  };

  // ── التخزين (كل قراية وكتابة في try/catch، والصفحة بتشتغل من غيره) ──
  var NS = "bb.";
  function load(k, d) { try { var v = localStorage.getItem(NS + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function wipeAll() { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(NS) === 0) localStorage.removeItem(k); }); return true; } catch (e) { return false; } }

  // ── الإشعارات ──
  function toast(msg, kind) {
    var box = $("[data-toasts]"); if (!box) return;
    var el = doc.createElement("div");
    el.className = "toast " + (kind === "err" ? "err" : "ok");
    el.innerHTML = (kind === "err" ? ICON.warn : ICON.check) + "<span>" + esc(msg) + "</span>";
    box.appendChild(el);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(function () { el.remove(); }, 3600);
  }

  // ── السلة: كل سطر = صنف + رقم الحجم + الإضافات + الكمية + ملاحظة. والسعر بيتحسب من القائمة كل مرة ──
  function validLine(l) {
    var it = l && ITEMS[l.id];
    if (!it || it.out || typeof l.s !== "number" || !it.sizes[l.s] || it.sizes[l.s].out) return false;
    l.q = Math.max(1, Math.min(50, parseInt(l.q, 10) || 1));
    l.a = (Array.isArray(l.a) ? l.a : []).filter(function (a) { return ITEMS[a] && ITEMS[a].addon && !ITEMS[a].out && a !== l.id; });
    l.n = String(l.n || "").slice(0, 200);
    return true;
  }
  var cart = load("cart", []).filter(validLine);
  function lineKey(l) { return [l.id, l.s, l.a.slice().sort().join("+"), l.n].join("|"); }
  function unit(l) {
    var p = ITEMS[l.id].sizes[l.s].p;
    l.a.forEach(function (a) { p += ITEMS[a].sizes[0].p; });
    return p;
  }
  function lineTotal(l) { return unit(l) * l.q; }
  function subtotal() { return cart.reduce(function (s, l) { return s + lineTotal(l); }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.q; }, 0); }
  function itemName(id) { return ITEMS[id] ? ITEMS[id][LANG] : id; }
  function lineDesc(l) {
    var it = ITEMS[l.id], parts = [];
    if (it.sizes.length > 1) parts.push(it.sizes[l.s][LANG]);
    l.a.forEach(function (a) { parts.push("+ " + itemName(a)); });
    if (l.n) parts.push("«" + l.n + "»");
    return parts.join(" · ");
  }
  function persist() {
    if (!save("cart", cart)) toast(L.noStore, "err");
    renderBadge(true); renderCart();
    if ($("[data-checkout]")) renderCheckout();
  }
  function addLine(l) {
    if (!validLine(l)) return false;
    var k = lineKey(l), ex = cart.filter(function (x) { return lineKey(x) === k; })[0];
    if (ex) ex.q = Math.min(50, ex.q + l.q); else cart.push(l);
    persist(); return true;
  }
  function renderBadge(bump) {
    var n = count();
    $$("[data-cart-count]").forEach(function (b) {
      b.hidden = n === 0; b.textContent = n > 99 ? "99+" : n;
      if (bump && n) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    });
  }
  function lineHTML(l, i, compact) {
    return '<div class="line"><img src="/img/menu/' + l.id + '-s.webp" alt="" width="72" height="72" loading="lazy">' +
      '<div><h4>' + esc(itemName(l.id)) + '</h4><div class="opts">' + esc(lineDesc(l)) + '</div>' +
      (compact ? '<div class="opts">× ' + l.q + '</div>' :
        '<div style="display:flex;align-items:center;gap:12px;margin-top:8px;flex-wrap:wrap"><div class="qty">' +
        '<button type="button" data-q="-1" data-i="' + i + '" aria-label="-">−</button><output aria-live="polite">' + l.q + '</output>' +
        '<button type="button" data-q="1" data-i="' + i + '" aria-label="+"' + (l.q >= 50 ? " disabled" : "") + '>+</button></div>' +
        '<button type="button" class="rm" data-rm="' + i + '">' + L.remove + '</button></div>') +
      '</div><div class="lp">' + money(lineTotal(l)) + '</div></div>';
  }
  function emptyCart() {
    return '<div class="cart-empty"><span class="ce-ic">' + ICON.cart + '</span><h3>' + L.cartEmptyH + '</h3><p>' + L.cartEmptyP + '</p>' +
      '<a class="btn btn-primary" href="' + PRE + 'menu/">' + L.browse + '</a></div>';
  }
  function renderCart() {
    var body = $("[data-cart-body]"), foot = $("[data-cart-foot]"); if (!body) return;
    if (!cart.length) { body.innerHTML = emptyCart(); foot.innerHTML = ""; return; }
    body.innerHTML = cart.map(function (l, i) { return lineHTML(l, i); }).join("");
    foot.innerHTML = '<div class="sum-row total"><span>' + L.subtotal + '</span><b>' + money(subtotal()) + '</b></div>' +
      '<a class="btn btn-primary btn-lg btn-block" href="' + PRE + 'checkout/">' + L.checkout + '</a>';
  }
  doc.addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]");
    if (q) {
      var l = cart[+q.dataset.i]; if (!l) return;
      l.q += +q.dataset.q;
      if (l.q < 1) { cart.splice(+q.dataset.i, 1); toast(t("removed", { n: itemName(l.id) })); } else { l.q = Math.min(50, l.q); toast(L.qty); }
      persist();
    } else if (rm) {
      var r = cart.splice(+rm.dataset.rm, 1)[0];
      if (r) { persist(); toast(t("removed", { n: itemName(r.id) })); }
    }
  });

  // ── الأدراج والطبقة والنوافذ ──
  var scrim = $("[data-scrim]"), lastFocus = null, openEl = null;
  function openLayer(el) {
    closeLayer(true);
    lastFocus = doc.activeElement; openEl = el; el.hidden = false;
    if (el.classList.contains("drawer")) scrim.hidden = false;
    doc.body.style.overflow = "hidden";
    var f = el.querySelector("[data-close]") || el.querySelector("button,a,input");
    if (f) setTimeout(function () { f.focus(); }, 30);
  }
  function closeLayer(silent) {
    if (!openEl) return;
    var was = openEl; openEl.hidden = true; openEl = null; scrim.hidden = true; doc.body.style.overflow = "";
    if (was.matches("[data-product-modal]")) onProductClosed();
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openEl) { e.preventDefault(); closeLayer(); }
    if (e.key === "Tab" && openEl) { // حبس الفوكس جوه الطبقة المفتوحة
      var f = $$("a[href],button:not([disabled]),input,select,textarea", openEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  scrim && scrim.addEventListener("click", function () { closeLayer(); });
  doc.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) { closeLayer(); return; }
    if (e.target.matches(".modal")) { closeLayer(); return; }
    if (e.target.closest("[data-open-cart]")) { renderCart(); openLayer($("[data-cart-drawer]")); return; }
    if (e.target.closest("[data-open-nav]")) { openLayer($("[data-nav-drawer]")); return; }
    if (e.target.closest("[data-open-address]")) { e.preventDefault(); onAddressChip(); return; }
    var oi = e.target.closest("[data-open-item]");
    if (oi && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openProduct(oi.dataset.openItem, true); }
  });

  // ── طريقة الطلب والعنوان في الهيدر ──
  var mode = load("mode", "delivery"); if (["delivery", "pickup", "dinein"].indexOf(mode) < 0) mode = "delivery";
  var addrs = load("addrs", []).filter(function (a) { return a && a.id && a.area && a.street; });
  var addrSel = load("addr", "");
  if (!addrs.some(function (a) { return a.id === addrSel; })) addrSel = addrs[0] ? addrs[0].id : "";
  function addrText(a) {
    return [a.street, a.building && (LANG === "ar" ? "عقار " : "Bldg ") + a.building, a.floor && (LANG === "ar" ? "الدور " : "Floor ") + a.floor,
      a.apt && (LANG === "ar" ? "شقة " : "Apt ") + a.apt, a.area].filter(Boolean).join("، ") + (a.landmark ? " (" + a.landmark + ")" : "");
  }
  function curAddr() { return addrs.filter(function (a) { return a.id === addrSel; })[0] || null; }
  function renderMode() {
    $$("[data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.mode === mode)); });
    var lab = $("[data-addr-label]"), val = $("[data-addr-value]"), a = curAddr();
    if (!lab) return;
    if (mode === "delivery") { lab.textContent = L.deliverTo; val.textContent = a ? (a.label ? a.label + " · " : "") + a.area : L.addAddr; }
    else { lab.textContent = mode === "pickup" ? L.pickupFrom : L.dineAt; val.textContent = L.restaurant; }
  }
  function setMode(m, quiet) {
    mode = m; save("mode", m); renderMode();
    if (!quiet) toast(t("modeSet", { m: L[m] }));
    if ($("[data-checkout]")) renderCheckout();
  }
  doc.addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) setMode(b.dataset.mode); });
  function onAddressChip() {
    if (mode !== "delivery") { toast(L.pickupInfo); return; }
    openAddress();
  }

  // ── نافذة العنوان ──
  var editingAddr = null;
  function openAddress(edit) {
    editingAddr = edit || null;
    var box = $("[data-am]"), a = edit || {};
    var list = !edit && addrs.length ? '<h3 class="sr">' + L.savedAddrs + '</h3><div class="saved">' + addrs.map(function (x) {
      return '<button type="button" data-pick-addr="' + x.id + '" aria-pressed="' + (x.id === addrSel) + '">' + ICON.pin +
        '<span><b>' + esc(x.label || L.home) + '</b><br><small class="muted">' + esc(addrText(x)) + '</small></span></button>';
    }).join("") + '</div><div class="am-or">' + L.orNew + '</div>' : "";
    function f(n, lab, req, full, ph) {
      return '<div class="f' + (full ? " full" : "") + '"><label for="a-' + n + '">' + lab + (req ? "" : ' <span class="opt">' + L.opt + "</span>") + '</label>' +
        '<input id="a-' + n + '" name="' + n + '" value="' + esc(a[n] || "") + '"' + (req ? " required" : "") + (ph ? ' placeholder="' + esc(ph) + '"' : "") + ' maxlength="120" autocomplete="off"><div class="err" hidden></div></div>';
    }
    box.innerHTML = '<h2 id="am-title">' + L.addrTitle + '</h2>' + list +
      '<form data-addr-form novalidate><div class="fields">' + f("label", L.addrLabel, false, true, L.addrLabelPh) + f("area", L.area, true, true) + f("street", L.street, true, true) +
      f("building", L.building, true) + f("floor", L.floor, false) + f("apt", L.apt, false) + f("landmark", L.landmark, false) + '</div>' +
      '<div class="am-actions"><button type="button" class="btn btn-ghost" data-close>' + L.cancel + '</button><button type="submit" class="btn btn-primary">' + L.saveAddr + '</button></div></form>';
    openLayer($("[data-address-modal]"));
  }
  function checkFields(form) {
    var ok = true;
    $$("[required]", form).forEach(function (i) {
      var bad = !i.value.trim(), er = i.parentNode.querySelector(".err");
      i.setAttribute("aria-invalid", String(bad)); if (er) { er.hidden = !bad; er.textContent = L.fieldReq; }
      if (bad && ok) { i.focus(); ok = false; }
    });
    return ok;
  }
  doc.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.matches("[data-addr-form]")) {
      e.preventDefault();
      if (!checkFields(f)) { toast(L.fixErrors, "err"); return; }
      var d = {}; ["label", "area", "street", "building", "floor", "apt", "landmark"].forEach(function (k) { d[k] = f.elements[k].value.trim().slice(0, 120); });
      if (editingAddr) { Object.assign(editingAddr, d); }
      else { d.id = "a" + Date.now().toString(36); addrs.unshift(d); addrs = addrs.slice(0, 10); addrSel = d.id; }
      var ok = save("addrs", addrs) && save("addr", addrSel);
      closeLayer(); renderMode(); refreshPages();
      toast(ok ? L.addrSaved : L.noStore, ok ? "ok" : "err");
    }
  });
  doc.addEventListener("click", function (e) {
    var p = e.target.closest("[data-pick-addr]"); if (!p) return;
    addrSel = p.dataset.pickAddr; save("addr", addrSel);
    if (p.closest("[data-address-modal]")) closeLayer();
    renderMode(); refreshPages(); toast(L.addrSelected);
  });
  function refreshPages() { if ($("[data-checkout]")) renderCheckout(); if ($("[data-account]")) renderAccount(); }

  // ── نافذة الصنف ──
  var pm = { id: null, s: -1, a: [], q: 1, pushed: false };
  function inMenuPage() { return !!$("[data-menu]"); }
  function openProduct(id, push) {
    var it = ITEMS[id]; if (!it) return;
    pm = { id: id, s: it.sizes.length === 1 ? 0 : -1, a: [], q: 1, pushed: false };
    var firstOk = it.sizes.findIndex ? it.sizes.findIndex(function (s) { return !s.out; }) : 0;
    if (it.sizes.length > 1 && firstOk >= 0) pm.s = firstOk;
    renderProduct();
    openLayer($("[data-product-modal]"));
    if (push && inMenuPage() && history.pushState) {
      history.pushState({ item: id }, "", PRE + "menu/" + id + "/"); pm.pushed = true;
    }
    doc.title = it[LANG] + " | " + (BB.name ? BB.name[LANG] : "");
  }
  var baseTitle = doc.title;
  function onProductClosed() {
    doc.title = baseTitle;
    if (inMenuPage() && /\/menu\/[^/]+\/?$/.test(location.pathname) && history.replaceState) {
      if (pm.pushed) history.back(); else history.replaceState({}, "", PRE + "menu/");
    }
  }
  window.addEventListener("popstate", function () {
    var m = location.pathname.match(/\/menu\/([^/]+)\/?$/);
    if (m && ITEMS[m[1]]) { if (!openEl) openProduct(m[1], false); }
    else if (openEl && openEl.matches("[data-product-modal]")) { pm.pushed = false; closeLayer(); }
  });
  function renderProduct() {
    var it = ITEMS[pm.id], box = $("[data-pm]");
    var sizes = it.sizes.length > 1 ? '<div class="og"><div class="og-h"><div><h3>' + L.size + '</h3><small>' + L.chooseOne + '</small></div><span class="og-tag ' + (pm.s >= 0 ? "ok" : "req") + '">' + (pm.s >= 0 ? L.done : L.required) + '</span></div>' +
      '<div class="sizes" role="radiogroup" aria-label="' + L.size + '">' + it.sizes.map(function (s, i) {
        return '<button type="button" class="sz" role="radio" data-sz="' + i + '" aria-checked="' + (pm.s === i) + '"' + (s.out ? " disabled" : "") + '>' + esc(s[LANG]) + '<small>' + money(s.p) + '</small></button>';
      }).join("") + '</div></div>' : "";
    var addons = it.addon ? "" : '<div class="og"><div class="og-h"><div><h3>' + L.addons + '</h3><small>' + L.addonsSub + '</small></div><span class="og-tag">' + L.optional + '</span></div><div class="addons">' +
      BB.addons.filter(function (a) { return a !== it.id && !ITEMS[a].out; }).map(function (a) {
        return '<button type="button" class="ad" data-ad="' + a + '" aria-pressed="' + (pm.a.indexOf(a) >= 0) + '"><img src="/img/menu/' + a + '-s.webp" alt="" width="48" height="48" loading="lazy"><span>' + esc(itemName(a)) + '<small>+ ' + money(ITEMS[a].sizes[0].p) + '</small></span></button>';
      }).join("") + '</div></div>';
    var note = '<div class="og"><div class="og-h"><h3><label for="pm-note">' + L.notes + '</label></h3><span class="og-tag">' + L.optional + '</span></div><textarea id="pm-note" class="note" maxlength="200" placeholder="' + esc(L.notesPh) + '"></textarea></div>';
    box.innerHTML = '<div class="pm-side"><div class="pm-img"><img src="/img/menu/' + it.id + '.webp" alt="' + esc(it[LANG]) + '" width="900" height="900"></div>' +
      '<div class="pm-buy" data-pm-buy></div></div>' +
      '<div class="pm-main"><div><h2 id="pm-title">' + esc(it[LANG]) + '</h2>' + (it["d" + LANG] ? '<p class="pm-desc">' + esc(it["d" + LANG]) + '</p>' : "") + '</div>' +
      (it.out ? '<p class="og-tag req" style="align-self:flex-start">' + L.soldOut + '</p>' : sizes + addons + note) + '</div>';
    renderBuy();
  }
  function renderBuy() {
    var it = ITEMS[pm.id], el = $("[data-pm-buy]"); if (!el) return;
    var tot = pm.s >= 0 ? unit({ id: pm.id, s: pm.s, a: pm.a }) * pm.q : 0;
    el.innerHTML = '<div class="row"><span>' + L.quantity + '</span><div class="qty"><button type="button" data-pq="-1" aria-label="-"' + (pm.q <= 1 ? " disabled" : "") + '>−</button><output aria-live="polite">' + pm.q + '</output><button type="button" data-pq="1" aria-label="+"' + (pm.q >= 50 ? " disabled" : "") + '>+</button></div></div>' +
      '<div class="row"><span class="pm-total"><small>' + L.total + '</small>' + (pm.s >= 0 ? money(tot) : (L.from + " " + money(it.sizes[0].p))) + '</span>' +
      '<button type="button" class="btn btn-primary btn-lg" data-pm-add' + (it.out ? " disabled" : "") + '>' + L.addToCart + '</button></div>';
  }
  doc.addEventListener("click", function (e) {
    var sz = e.target.closest("[data-sz]"), ad = e.target.closest("[data-ad]"), pq = e.target.closest("[data-pq]"), add = e.target.closest("[data-pm-add]");
    if (sz) { pm.s = +sz.dataset.sz; $$("[data-sz]").forEach(function (b) { b.setAttribute("aria-checked", String(+b.dataset.sz === pm.s)); }); var tg = sz.closest(".og").querySelector(".og-tag"); tg.className = "og-tag ok"; tg.textContent = L.done; renderBuy(); }
    else if (ad) { var a = ad.dataset.ad, i = pm.a.indexOf(a); if (i >= 0) pm.a.splice(i, 1); else pm.a.push(a); ad.setAttribute("aria-pressed", String(i < 0)); renderBuy(); }
    else if (pq) { pm.q = Math.max(1, Math.min(50, pm.q + +pq.dataset.pq)); renderBuy(); }
    else if (add) {
      if (pm.s < 0) { toast(L.pickSize, "err"); var g = $(".sizes"); if (g) g.querySelector("button:not([disabled])").focus(); return; }
      var note = $("#pm-note");
      var ok = addLine({ id: pm.id, s: pm.s, a: pm.a.slice(), q: pm.q, n: note ? note.value.trim() : "" });
      if (ok) { closeLayer(); toast(t("added", { n: itemName(pm.id) })); }
      else toast(L.soldOut, "err");
    }
  });

  // ── صفحة القائمة: التبويبات والبحث ──
  function initMenu() {
    var menu = $("[data-menu]"); if (!menu) return;
    var tabs = $$("[data-tab]"), secs = $$(".msec", menu);
    function on(id) { tabs.forEach(function (a) { var y = a.dataset.tab === id; a.classList.toggle("is-on", y); if (y && a.scrollIntoView && window.innerWidth < 980) { var p = a.parentNode; p.scrollTo({ left: a.offsetLeft - p.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" }); } }); }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) on(en.target.id); }); }, { rootMargin: "-45% 0px -50% 0px" });
      secs.forEach(function (s) { io.observe(s); });
    }
    if (secs[0]) on(secs[0].id);
    var inp = $("[data-search]"), empty = $("[data-search-empty]");
    inp && inp.addEventListener("input", function () {
      var q = inp.value.trim().toLowerCase(), any = false;
      secs.forEach(function (s) {
        var vis = 0;
        $$(".card", s).forEach(function (c) { var it = ITEMS[c.dataset.item], hit = !q || (it.ar + " " + it.en + " " + it.dar + " " + it.den).toLowerCase().indexOf(q) >= 0; c.hidden = !hit; if (hit) vis++; });
        s.hidden = !vis; if (vis) any = true;
      });
      empty.hidden = any;
    });
    if (menu.dataset.open) openProduct(menu.dataset.open, false);
  }

  // ── الهيرو ──
  function initCarousel() {
    var c = $("[data-carousel]"); if (!c) return;
    var slides = $$(".slide", c), dots = $$("[data-dot]", c), i = 0, timer = null;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function go(n) { i = (n + slides.length) % slides.length; slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); s.setAttribute("aria-hidden", String(k !== i)); }); dots.forEach(function (d, k) { d.classList.toggle("is-on", k === i); d.setAttribute("aria-current", String(k === i)); }); }
    function play() { stop(); if (!reduce) timer = setInterval(function () { go(i + 1); }, 6000); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    var dirF = LANG === "ar" ? -1 : 1;
    c.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) { go(i + 1); play(); }
      else if (e.target.closest("[data-prev]")) { go(i - 1); play(); }
      else if (e.target.closest("[data-dot]")) { go(+e.target.closest("[data-dot]").dataset.dot); play(); }
    });
    c.addEventListener("mouseenter", stop); c.addEventListener("mouseleave", play);
    c.addEventListener("focusin", stop); c.addEventListener("focusout", play);
    var x0 = null;
    c.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    c.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1) * dirF); play(); } x0 = null; });
    doc.addEventListener("visibilitychange", function () { if (doc.hidden) stop(); else play(); });
    go(0); play();
  }

  // ── إتمام الطلب ──
  var coDraft = load("profile", { name: "", phone: "" }); coDraft.notes = "";
  var lastOrder = null;
  function normPhone(p) {
    p = String(p || "").replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }).replace(/[\s-]/g, "");
    if (/^\+?20/.test(p)) p = "0" + p.replace(/^\+?20/, "");
    return p;
  }
  function phoneOk(p) { return /^01[0125]\d{8}$/.test(normPhone(p)); }
  function renderCheckout() {
    var root = $("[data-checkout]"); if (!root) return;
    if (lastOrder) { root.innerHTML = doneHTML(lastOrder); return; }
    if (!cart.length) { root.innerHTML = '<div class="box" style="grid-column:1/-1">' + emptyCart() + '</div>'; return; }
    var m3 = [["delivery", ICON.bike], ["pickup", ICON.store], ["dinein", ICON.seat]].map(function (m) {
      return '<button type="button" class="m3" role="radio" data-mode="' + m[0] + '" aria-checked="' + (mode === m[0]) + '">' + m[1] + '<span>' + L[m[0]] + '</span></button>';
    }).join("");
    var n = 1, a = curAddr();
    var addrBox = mode === "delivery" ? '<section class="box"><h2><span class="n">' + (++n + 1) + '</span>' + L.coAddr + '</h2>' +
      (addrs.length ? '<div class="saved">' + addrs.map(function (x) { return '<button type="button" data-pick-addr="' + x.id + '" aria-pressed="' + (x.id === addrSel) + '">' + ICON.pin + '<span><b>' + esc(x.label || L.home) + '</b><br><small class="muted">' + esc(addrText(x)) + '</small></span></button>'; }).join("") + '</div>' : '<p class="muted" style="margin-bottom:12px">' + L.noAddr + '</p>') +
      '<button type="button" class="btn btn-ghost" data-open-address>' + ICON.pin + L.addNewAddr + '</button><div class="err" data-addr-err hidden style="color:var(--danger);margin-top:8px">' + L.chooseAddr + '</div></section>' :
      '<section class="box"><p class="hint" style="display:flex;gap:8px;align-items:center">' + ICON.info + L.pickupInfo + '</p></section>';
    root.innerHTML = '<div class="co-main">' +
      '<section class="box"><h2><span class="n">1</span>' + L.coMode + '</h2><div class="modes3" role="radiogroup" aria-label="' + L.coMode + '">' + m3 + '</div></section>' +
      '<section class="box"><h2><span class="n">2</span>' + L.coContact + '</h2><form data-co-form novalidate><div class="fields">' +
      '<div class="f"><label for="co-name">' + L.name + '</label><input id="co-name" name="name" required maxlength="60" autocomplete="name" value="' + esc(coDraft.name) + '"><div class="err" hidden></div></div>' +
      '<div class="f"><label for="co-phone">' + L.phone + '</label><input id="co-phone" name="phone" required inputmode="tel" dir="ltr" maxlength="16" autocomplete="tel" placeholder="' + L.phonePh + '" value="' + esc(coDraft.phone) + '"><div class="err" hidden></div></div>' +
      '</div></form></section>' + addrBox +
      '<section class="box"><h2><span class="n">' + (n + 2) + '</span><label for="co-notes">' + L.coNotes + '</label></h2><div class="f"><textarea id="co-notes" maxlength="300" placeholder="' + esc(L.orderNotesPh) + '">' + esc(coDraft.notes) + '</textarea></div></section>' +
      '<section class="box"><h2><span class="n">' + (n + 3) + '</span>' + L.coPay + '</h2><div class="pay">' + ICON.cash + L.cash + '</div></section>' +
      '</div><aside class="co-side"><section class="box"><h2>' + L.coSummary + '</h2>' + cart.map(function (l, i) { return lineHTML(l, i); }).join("") +
      '<div style="display:grid;gap:10px;margin-top:16px"><div class="sum-row"><span>' + L.subtotal + '</span><b>' + money(subtotal()) + '</b></div>' +
      (mode === "delivery" ? '<div class="sum-row"><span>' + L.deliveryFee + '</span><span>' + L.feeByArea + '</span></div>' : "") +
      '<div class="sum-row total"><span>' + (mode === "delivery" ? L.totalNoFee : L.totalAll) + '</span><b>' + money(subtotal()) + '</b></div>' +
      '<button type="button" class="btn btn-primary btn-lg btn-block" data-send>' + ICON.chat + L.send + '</button>' +
      '<a class="btn btn-ghost btn-block" href="' + PRE + 'menu/">' + L.editCart + '</a></div></section></aside>';
    $$("[data-mode]", root).forEach(function (b) { b.setAttribute("aria-checked", String(b.dataset.mode === mode)); });
    ["co-name", "co-phone", "co-notes"].forEach(function (id) {
      var el = $("#" + id); el && el.addEventListener("input", function () { coDraft[{ "co-name": "name", "co-phone": "phone", "co-notes": "notes" }[id]] = el.value; });
    });
  }
  function orderMsg(o) {
    var lines = [t("msgHead", { s: BB.name ? BB.name[LANG] : "" }), L.msgNo + ": " + o.ref, L.msgMode + ": " + L[o.mode], L.msgName + ": " + o.name, L.msgPhone + ": " + o.phone];
    if (o.mode === "delivery") lines.push(L.msgAddr + ": " + o.addr);
    lines.push("—");
    o.lines.forEach(function (l) { lines.push(l.q + "× " + itemName(l.id) + (lineDesc(l) ? " (" + lineDesc(l) + ")" : "") + " = " + money(lineTotal(l))); });
    lines.push("—", (o.mode === "delivery" ? L.totalNoFee : L.totalAll) + ": " + money(o.total), L.msgPay + ": " + L.cash);
    if (o.notes) lines.push(L.msgNotes + ": " + o.notes);
    return lines.join("\n");
  }
  function waUrl(o) { return "https://wa.me/" + BB.biz.wa + "?text=" + encodeURIComponent(orderMsg(o)); }
  function doneHTML(o) {
    return '<div class="box done" style="grid-column:1/-1"><span class="ok-ic">' + ICON.check + '</span><h2>' + L.sentH + '</h2><p class="muted">' + L.sentP + '</p>' +
      '<p>' + L.refNo + ': <code>' + esc(o.ref) + '</code></p><p class="hint">' + L.waNote + '</p>' +
      '<a class="btn btn-primary btn-lg" href="' + waUrl(o) + '" target="_blank" rel="noopener">' + ICON.chat + L.openWa + '</a>' +
      '<p class="hint">' + L.callInstead + ': <a href="tel:' + esc(BB.biz.phone) + '" dir="ltr">' + esc(BB.biz.phone) + '</a></p>' +
      '<a class="link" href="' + PRE + 'account/#orders">' + L.myOrders + '</a></div>';
  }
  doc.addEventListener("click", function (e) {
    if (!e.target.closest("[data-send]")) return;
    var f = $("[data-co-form]"), ok = checkFields(f), ph = f.elements.phone;
    if (ok && !phoneOk(ph.value)) { ok = false; ph.setAttribute("aria-invalid", "true"); var er = ph.parentNode.querySelector(".err"); er.hidden = false; er.textContent = L.phoneBad; ph.focus(); }
    var a = curAddr(), ae = $("[data-addr-err]");
    if (mode === "delivery" && !a) { if (ae) ae.hidden = false; if (ok) { ok = false; var b = $("[data-checkout] [data-open-address]"); b && b.focus(); } }
    if (!ok) { toast(L.sendFail, "err"); return; }
    var d = new Date(), pad = function (x) { return ("0" + x).slice(-2); };
    var o = {
      ref: "BR-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + pad(d.getHours()) + pad(d.getMinutes()) + "-" + Math.floor(100 + Math.random() * 900),
      at: d.toISOString(), mode: mode, name: f.elements.name.value.trim(), phone: normPhone(ph.value),
      addr: mode === "delivery" ? (a.label ? a.label + ": " : "") + addrText(a) : "", notes: ($("#co-notes").value || "").trim().slice(0, 300),
      lines: JSON.parse(JSON.stringify(cart)), total: subtotal()
    };
    var orders = load("orders", []); orders.unshift(o); save("orders", orders.slice(0, 30));
    save("profile", { name: o.name, phone: o.phone });
    var w = window.open(waUrl(o), "_blank", "noopener");
    lastOrder = o; cart = []; persist();
    toast(t("orderSaved", { r: o.ref }));
    if (!w) { /* المتصفح منع فتح نافذة: زرار «فتح واتساب» ظاهر في صفحة التأكيد */ }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── حسابي ──
  var accTab = (location.hash || "").replace("#", "") || "profile";
  function renderAccount() {
    var root = $("[data-account]"); if (!root) return;
    if (["profile", "addresses", "orders", "data"].indexOf(accTab) < 0) accTab = "profile";
    var tabs = [["profile", L.tProfile, ICON.user], ["addresses", L.tAddrs, ICON.pin], ["orders", L.tOrders, ICON.list], ["data", L.tData, ICON.shield]];
    var nav = '<nav class="acc-nav" role="tablist" aria-label="' + esc($("h1") ? $("h1").textContent : "") + '">' + tabs.map(function (x) {
      return '<button type="button" role="tab" data-acc="' + x[0] + '" aria-selected="' + (accTab === x[0]) + '">' + x[2] + x[1] + '</button>';
    }).join("") + '</nav>';
    var body = "", pr = load("profile", { name: "", phone: "" });
    if (accTab === "profile") {
      body = '<form class="box" data-profile-form novalidate><h2>' + L.tProfile + '</h2><div class="fields">' +
        '<div class="f"><label for="p-name">' + L.name + '</label><input id="p-name" name="name" required maxlength="60" value="' + esc(pr.name) + '"><div class="err" hidden></div></div>' +
        '<div class="f"><label for="p-phone">' + L.phone + '</label><input id="p-phone" name="phone" required inputmode="tel" dir="ltr" maxlength="16" placeholder="' + L.phonePh + '" value="' + esc(pr.phone) + '"><div class="err" hidden></div></div></div>' +
        '<div class="am-actions"><button class="btn btn-primary" type="submit">' + L.save + '</button></div></form>';
    } else if (accTab === "addresses") {
      body = '<section class="box"><h2>' + L.tAddrs + '</h2>' + (addrs.length ? addrs.map(function (x) {
        return '<div class="addr-card"><div><b>' + esc(x.label || L.home) + '</b>' + (x.id === addrSel ? '<span class="tagd">' + L.def + '</span>' : "") + '<p>' + esc(addrText(x)) + '</p></div><div class="actions">' +
          (x.id === addrSel ? "" : '<button class="btn btn-ghost" type="button" data-def-addr="' + x.id + '">' + L.makeDefault + '</button>') +
          '<button class="btn btn-ghost" type="button" data-edit-addr="' + x.id + '">' + L.edit + '</button><button class="btn btn-ghost" type="button" data-del-addr="' + x.id + '">' + L.del + '</button></div></div>';
      }).join("") : '<p class="muted" style="margin-bottom:12px">' + L.noAddr + '</p>') +
        '<button class="btn btn-primary" type="button" data-new-addr>' + L.addNewAddr + '</button></section>';
    } else if (accTab === "orders") {
      var os = load("orders", []);
      body = '<section class="box"><h2>' + L.tOrders + '</h2>' + (os.length ? os.map(function (o, i) {
        var d = new Date(o.at);
        return '<div class="order-card"><div class="oc-h"><b>' + esc(o.ref) + '</b><span class="muted">' + esc(isNaN(d) ? "" : d.toLocaleString(LANG === "ar" ? "ar-EG" : "en-GB")) + '</span></div>' +
          '<div class="muted">' + esc(L[o.mode] || "") + ' · ' + esc(L.sent) + '</div><ul>' + (o.lines || []).map(function (l) { return "<li>" + l.q + "× " + esc(itemName(l.id)) + "</li>"; }).join("") + '</ul>' +
          '<div class="oc-h"><b>' + money(o.total || 0) + '</b><button class="btn btn-ghost" type="button" data-reorder="' + i + '">' + L.reorder + '</button></div></div>';
      }).join("") : '<p class="muted">' + L.noOrders + '</p><p style="margin-top:12px"><a class="btn btn-primary" href="' + PRE + 'menu/">' + L.browse + '</a></p>') + '</section>';
    } else {
      body = '<section class="box"><h2>' + L.tData + '</h2><p class="muted" style="margin-bottom:16px">' + L.dataP + '</p><button class="btn btn-danger" type="button" data-wipe>' + L.wipe + '</button></section>';
    }
    root.innerHTML = nav + '<div><div class="acc-note">' + ICON.info + '<span>' + L.accNote + '</span></div>' + body + '</div>';
  }
  doc.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-acc]"))) { accTab = b.dataset.acc; if (history.replaceState) history.replaceState({}, "", "#" + accTab); renderAccount(); var nb = $('[data-acc="' + accTab + '"]'); nb && nb.focus(); }
    else if ((b = e.target.closest("[data-new-addr]"))) openAddress();
    else if ((b = e.target.closest("[data-edit-addr]"))) openAddress(addrs.filter(function (x) { return x.id === b.dataset.editAddr; })[0]);
    else if ((b = e.target.closest("[data-del-addr]"))) {
      addrs = addrs.filter(function (x) { return x.id !== b.dataset.delAddr; });
      if (addrSel === b.dataset.delAddr) addrSel = addrs[0] ? addrs[0].id : "";
      save("addrs", addrs); save("addr", addrSel); renderMode(); renderAccount(); toast(L.addrDeleted);
    }
    else if ((b = e.target.closest("[data-def-addr]"))) { addrSel = b.dataset.defAddr; save("addr", addrSel); renderMode(); renderAccount(); toast(L.defSet); }
    else if ((b = e.target.closest("[data-reorder]"))) {
      var o = load("orders", [])[+b.dataset.reorder], n = 0;
      (o && o.lines || []).forEach(function (l) { if (addLine(JSON.parse(JSON.stringify(l)))) n++; });
      if (n) { toast(t("reordered", { n: n })); renderCart(); openLayer($("[data-cart-drawer]")); } else toast(L.reorderNone, "err");
    }
    else if ((b = e.target.closest("[data-wipe]"))) {
      if (!b.dataset.armed) { b.dataset.armed = "1"; b.dataset.label = b.textContent; b.textContent = L.wipeConfirm; setTimeout(function () { if (b.isConnected) { delete b.dataset.armed; b.textContent = b.dataset.label; } }, 4000); return; }
      var ok = wipeAll();
      cart = []; addrs = []; addrSel = ""; mode = "delivery"; coDraft = { name: "", phone: "", notes: "" };
      renderBadge(); renderCart(); renderMode(); refreshPages();
      delete b.dataset.armed; b.textContent = b.dataset.label || L.wipe;
      toast(ok ? L.wiped : L.noStore, ok ? "ok" : "err");
    }
  });
  doc.addEventListener("submit", function (e) {
    var f = e.target; if (!f.matches("[data-profile-form]")) return;
    e.preventDefault();
    var ok = checkFields(f), ph = f.elements.phone;
    if (ok && !phoneOk(ph.value)) { ok = false; ph.setAttribute("aria-invalid", "true"); var er = ph.parentNode.querySelector(".err"); er.hidden = false; er.textContent = L.phoneBad; ph.focus(); }
    if (!ok) { toast(L.fixErrors, "err"); return; }
    var s = save("profile", { name: f.elements.name.value.trim(), phone: normPhone(ph.value) });
    coDraft.name = f.elements.name.value.trim(); coDraft.phone = normPhone(ph.value);
    toast(s ? L.profileSaved : L.noStore, s ? "ok" : "err");
  });

  // ── الزرار العائم والرجوع لفوق ──
  doc.addEventListener("click", function (e) {
    var fb = e.target.closest("[data-fab-toggle]");
    var menu = $(".fab-menu");
    if (fb) { var open = menu.hidden; menu.hidden = !open; fb.setAttribute("aria-expanded", String(open)); return; }
    if (menu && !menu.hidden && !e.target.closest("[data-fab]")) { menu.hidden = true; $("[data-fab-toggle]").setAttribute("aria-expanded", "false"); }
    if (e.target.closest("[data-to-top]")) { window.scrollTo({ top: 0, behavior: "smooth" }); var m = $("#main"); m && m.focus({ preventScroll: true }); }
  });
  var tt = $("[data-to-top]");
  window.addEventListener("scroll", function () { if (tt) tt.hidden = window.scrollY < 700; }, { passive: true });

  // ── البداية ──
  renderBadge(); renderCart(); renderMode(); initMenu(); initCarousel(); renderCheckout(); renderAccount();
})();
