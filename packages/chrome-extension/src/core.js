/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis, He = de.ShadowRoot && (de.ShadyCSS === void 0 || de.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ie = Symbol(), Me = /* @__PURE__ */ new WeakMap();
let et = class {
  constructor(e, n, r) {
    if (this._$cssResult$ = !0, r !== Ie)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (He && e === void 0) {
      const r = n !== void 0 && n.length === 1;
      r && (e = Me.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Me.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const W = (t) => new et(typeof t == "string" ? t : t + "", void 0, Ie), pt = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((r, i, a) => r + ((s) => {
    if (s._$cssResult$ === !0)
      return s.cssText;
    if (typeof s == "number")
      return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[a + 1], t[0]);
  return new et(n, t, Ie);
}, mt = (t, e) => {
  if (He)
    t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else
    for (const n of e) {
      const r = document.createElement("style"), i = de.litNonce;
      i !== void 0 && r.setAttribute("nonce", i), r.textContent = n.cssText, t.appendChild(r);
    }
}, Be = He ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const r of e.cssRules)
    n += r.cssText;
  return W(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ft, defineProperty: bt, getOwnPropertyDescriptor: gt, getOwnPropertyNames: vt, getOwnPropertySymbols: yt, getPrototypeOf: wt } = Object, I = globalThis, ze = I.trustedTypes, _t = ze ? ze.emptyScript : "", Ae = I.reactiveElementPolyfillSupport, Y = (t, e) => t, ye = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? _t : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let n = t;
  switch (e) {
    case Boolean:
      n = t !== null;
      break;
    case Number:
      n = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(t);
      } catch {
        n = null;
      }
  }
  return n;
} }, Ue = (t, e) => !ft(t, e), Fe = { attribute: !0, type: String, converter: ye, reflect: !1, hasChanged: Ue };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), I.litPropertyMetadata ?? (I.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class z extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Fe) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.elementProperties.set(e, n), !n.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, n);
      i !== void 0 && bt(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, n, r) {
    const { get: i, set: a } = gt(this.prototype, e) ?? { get() {
      return this[n];
    }, set(s) {
      this[n] = s;
    } };
    return { get() {
      return i == null ? void 0 : i.call(this);
    }, set(s) {
      const d = i == null ? void 0 : i.call(this);
      a.call(this, s), this.requestUpdate(e, d, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Fe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Y("elementProperties")))
      return;
    const e = wt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Y("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Y("properties"))) {
      const n = this.properties, r = [...vt(n), ...yt(n)];
      for (const i of r)
        this.createProperty(i, n[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const n = litPropertyMetadata.get(e);
      if (n !== void 0)
        for (const [r, i] of n)
          this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, r] of this.elementProperties) {
      const i = this._$Eu(n, r);
      i !== void 0 && this._$Eh.set(i, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const n = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r)
        n.unshift(Be(i));
    } else
      e !== void 0 && n.push(Be(e));
    return n;
  }
  static _$Eu(e, n) {
    const r = n.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$Eg = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$ES(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((n) => n(this));
  }
  addController(e) {
    var n;
    (this._$E_ ?? (this._$E_ = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((n = e.hostConnected) == null || n.call(e));
  }
  removeController(e) {
    var n;
    (n = this._$E_) == null || n.delete(e);
  }
  _$ES() {
    const e = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const r of n.keys())
      this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return mt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$E_) == null || e.forEach((n) => {
      var r;
      return (r = n.hostConnected) == null ? void 0 : r.call(n);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$E_) == null || e.forEach((n) => {
      var r;
      return (r = n.hostDisconnected) == null ? void 0 : r.call(n);
    });
  }
  attributeChangedCallback(e, n, r) {
    this._$AK(e, r);
  }
  _$EO(e, n) {
    var a;
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const s = (((a = r.converter) == null ? void 0 : a.toAttribute) !== void 0 ? r.converter : ye).toAttribute(n, r.type);
      this._$Em = e, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var a;
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const s = r.getPropertyOptions(i), d = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((a = s.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? s.converter : ye;
      this._$Em = i, this[i] = d.fromAttribute(n, s.type), this._$Em = null;
    }
  }
  requestUpdate(e, n, r, i = !1, a) {
    if (e !== void 0) {
      if (r ?? (r = this.constructor.getPropertyOptions(e)), !(r.hasChanged ?? Ue)(i ? a : this[e], n))
        return;
      this.C(e, n, r);
    }
    this.isUpdatePending === !1 && (this._$Eg = this._$EP());
  }
  C(e, n, r) {
    this._$AL.has(e) || this._$AL.set(e, n), r.reflect === !0 && this._$Em !== e && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(e);
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$Eg;
    } catch (n) {
      Promise.reject(n);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, s] of this._$Ep)
          this[a] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0)
        for (const [a, s] of i)
          s.wrapped !== !0 || this._$AL.has(a) || this[a] === void 0 || this.C(a, this[a], s);
    }
    let e = !1;
    const n = this._$AL;
    try {
      e = this.shouldUpdate(n), e ? (this.willUpdate(n), (r = this._$E_) == null || r.forEach((i) => {
        var a;
        return (a = i.hostUpdate) == null ? void 0 : a.call(i);
      }), this.update(n)) : this._$ET();
    } catch (i) {
      throw e = !1, this._$ET(), i;
    }
    e && this._$AE(n);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var n;
    (n = this._$E_) == null || n.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((n) => this._$EO(n, this[n]))), this._$ET();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
}
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[Y("elementProperties")] = /* @__PURE__ */ new Map(), z[Y("finalized")] = /* @__PURE__ */ new Map(), Ae == null || Ae({ ReactiveElement: z }), (I.reactiveElementVersions ?? (I.reactiveElementVersions = [])).push("2.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, we = X.trustedTypes, Ke = we ? we.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, tt = "$lit$", H = `lit$${(Math.random() + "").slice(9)}$`, nt = "?" + H, Pt = `<${nt}>`, M = document, Q = () => M.createComment(""), ee = (t) => t === null || typeof t != "object" && typeof t != "function", rt = Array.isArray, $t = (t) => rt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Se = `[ 	
\f\r]`, G = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ve = /-->/g, We = />/g, D = RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ze = /'/g, Ge = /"/g, it = /^(?:script|style|textarea|title)$/i, Ct = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), U = Ct(1), B = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Je = /* @__PURE__ */ new WeakMap(), j = M.createTreeWalker(M, 129);
function ot(t, e) {
  if (!Array.isArray(t) || !t.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Ke !== void 0 ? Ke.createHTML(e) : e;
}
const xt = (t, e) => {
  const n = t.length - 1, r = [];
  let i, a = e === 2 ? "<svg>" : "", s = G;
  for (let d = 0; d < n; d++) {
    const o = t[d];
    let b, m, u = -1, y = 0;
    for (; y < o.length && (s.lastIndex = y, m = s.exec(o), m !== null); )
      y = s.lastIndex, s === G ? m[1] === "!--" ? s = Ve : m[1] !== void 0 ? s = We : m[2] !== void 0 ? (it.test(m[2]) && (i = RegExp("</" + m[2], "g")), s = D) : m[3] !== void 0 && (s = D) : s === D ? m[0] === ">" ? (s = i ?? G, u = -1) : m[1] === void 0 ? u = -2 : (u = s.lastIndex - m[2].length, b = m[1], s = m[3] === void 0 ? D : m[3] === '"' ? Ge : Ze) : s === Ge || s === Ze ? s = D : s === Ve || s === We ? s = G : (s = D, i = void 0);
    const $ = s === D && t[d + 1].startsWith("/>") ? " " : "";
    a += s === G ? o + Pt : u >= 0 ? (r.push(b), o.slice(0, u) + tt + o.slice(u) + H + $) : o + H + (u === -2 ? d : $);
  }
  return [ot(t, a + (t[n] || "<?>") + (e === 2 ? "</svg>" : "")), r];
};
class te {
  constructor({ strings: e, _$litType$: n }, r) {
    let i;
    this.parts = [];
    let a = 0, s = 0;
    const d = e.length - 1, o = this.parts, [b, m] = xt(e, n);
    if (this.el = te.createElement(b, r), j.currentNode = this.el.content, n === 2) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = j.nextNode()) !== null && o.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes())
          for (const u of i.getAttributeNames())
            if (u.endsWith(tt)) {
              const y = m[s++], $ = i.getAttribute(u).split(H), T = /([.?@])?(.*)/.exec(y);
              o.push({ type: 1, index: a, name: T[2], strings: $, ctor: T[1] === "." ? Et : T[1] === "?" ? At : T[1] === "@" ? St : Pe }), i.removeAttribute(u);
            } else
              u.startsWith(H) && (o.push({ type: 6, index: a }), i.removeAttribute(u));
        if (it.test(i.tagName)) {
          const u = i.textContent.split(H), y = u.length - 1;
          if (y > 0) {
            i.textContent = we ? we.emptyScript : "";
            for (let $ = 0; $ < y; $++)
              i.append(u[$], Q()), j.nextNode(), o.push({ type: 2, index: ++a });
            i.append(u[y], Q());
          }
        }
      } else if (i.nodeType === 8)
        if (i.data === nt)
          o.push({ type: 2, index: a });
        else {
          let u = -1;
          for (; (u = i.data.indexOf(H, u + 1)) !== -1; )
            o.push({ type: 7, index: a }), u += H.length - 1;
        }
      a++;
    }
  }
  static createElement(e, n) {
    const r = M.createElement("template");
    return r.innerHTML = e, r;
  }
}
function F(t, e, n = t, r) {
  var s, d;
  if (e === B)
    return e;
  let i = r !== void 0 ? (s = n._$Co) == null ? void 0 : s[r] : n._$Cl;
  const a = ee(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== a && ((d = i == null ? void 0 : i._$AO) == null || d.call(i, !1), a === void 0 ? i = void 0 : (i = new a(t), i._$AT(t, n, r)), r !== void 0 ? (n._$Co ?? (n._$Co = []))[r] = i : n._$Cl = i), i !== void 0 && (e = F(t, i._$AS(t, e.values), i, r)), e;
}
class kt {
  constructor(e, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: n }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? M).importNode(n, !0);
    j.currentNode = i;
    let a = j.nextNode(), s = 0, d = 0, o = r[0];
    for (; o !== void 0; ) {
      if (s === o.index) {
        let b;
        o.type === 2 ? b = new ne(a, a.nextSibling, this, e) : o.type === 1 ? b = new o.ctor(a, o.name, o.strings, this, e) : o.type === 6 && (b = new Ot(a, this, e)), this._$AV.push(b), o = r[++d];
      }
      s !== (o == null ? void 0 : o.index) && (a = j.nextNode(), s++);
    }
    return j.currentNode = M, i;
  }
  p(e) {
    let n = 0;
    for (const r of this._$AV)
      r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, n), n += r.strings.length - 2) : r._$AI(e[n])), n++;
  }
}
class ne {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, n, r, i) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = n.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, n = this) {
    e = F(this, e, n), ee(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== B && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : $t(e) ? this.T(e) : this._(e);
  }
  k(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  $(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.k(e));
  }
  _(e) {
    this._$AH !== v && ee(this._$AH) ? this._$AA.nextSibling.data = e : this.$(M.createTextNode(e)), this._$AH = e;
  }
  g(e) {
    var a;
    const { values: n, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = te.createElement(ot(r.h, r.h[0]), this.options)), r);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === i)
      this._$AH.p(n);
    else {
      const s = new kt(i, this), d = s.u(this.options);
      s.p(n), this.$(d), this._$AH = s;
    }
  }
  _$AC(e) {
    let n = Je.get(e.strings);
    return n === void 0 && Je.set(e.strings, n = new te(e)), n;
  }
  T(e) {
    rt(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let r, i = 0;
    for (const a of e)
      i === n.length ? n.push(r = new ne(this.k(Q()), this.k(Q()), this, this.options)) : r = n[i], r._$AI(a), i++;
    i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, n); e && e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
}
class Pe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, r, i, a) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = n, this._$AM = i, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = v;
  }
  _$AI(e, n = this, r, i) {
    const a = this.strings;
    let s = !1;
    if (a === void 0)
      e = F(this, e, n, 0), s = !ee(e) || e !== this._$AH && e !== B, s && (this._$AH = e);
    else {
      const d = e;
      let o, b;
      for (e = a[0], o = 0; o < a.length - 1; o++)
        b = F(this, d[r + o], n, o), b === B && (b = this._$AH[o]), s || (s = !ee(b) || b !== this._$AH[o]), b === v ? e = v : e !== v && (e += (b ?? "") + a[o + 1]), this._$AH[o] = b;
    }
    s && !i && this.O(e);
  }
  O(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Et extends Pe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  O(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class At extends Pe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  O(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
class St extends Pe {
  constructor(e, n, r, i, a) {
    super(e, n, r, i, a), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = F(this, e, n, 0) ?? v) === B)
      return;
    const r = this._$AH, i = e === v && r !== v || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== v && (r === v || i);
    i && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ot {
  constructor(e, n, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    F(this, e);
  }
}
const Oe = X.litHtmlPolyfillSupport;
Oe == null || Oe(te, ne), (X.litHtmlVersions ?? (X.litHtmlVersions = [])).push("3.1.0");
const Rt = (t, e, n) => {
  const r = (n == null ? void 0 : n.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const a = (n == null ? void 0 : n.renderBefore) ?? null;
    r._$litPart$ = i = new ne(e.insertBefore(Q(), a), a, void 0, n ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class R extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var n;
    const e = super.createRenderRoot();
    return (n = this.renderOptions).renderBefore ?? (n.renderBefore = e.firstChild), e;
  }
  update(e) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Rt(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return B;
  }
}
var Qe;
R._$litElement$ = !0, R.finalized = !0, (Qe = globalThis.litElementHydrateSupport) == null || Qe.call(globalThis, { LitElement: R });
const Re = globalThis.litElementPolyfillSupport;
Re == null || Re({ LitElement: R });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = (t) => (e, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = { attribute: !0, type: String, converter: ye, reflect: !1, hasChanged: Ue }, qt = (t = Tt, e, n) => {
  const { kind: r, metadata: i } = n;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), a.set(n.name, t), r === "accessor") {
    const { name: s } = n;
    return { set(d) {
      const o = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(s, o, t);
    }, init(d) {
      return d !== void 0 && this.C(s, void 0, t), d;
    } };
  }
  if (r === "setter") {
    const { name: s } = n;
    return function(d) {
      const o = this[s];
      e.call(this, d), this.requestUpdate(s, o, t);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function w(t) {
  return (e, n) => typeof n == "object" ? qt(t, e, n) : ((r, i, a) => {
    const s = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s ? { ...r, wrapped: !0 } : r), s ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(t) {
  return w({ ...t, state: !0, attribute: !1 });
}
const ie = `/*
! tailwindcss v3.4.0 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  font-feature-settings: normal;
  /* 5 */
  font-variation-settings: normal;
  /* 6 */
  -webkit-tap-highlight-color: transparent;
  /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-feature-settings: normal;
  /* 2 */
  font-variation-settings: normal;
  /* 3 */
  font-size: 1em;
  /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-feature-settings: inherit;
  /* 1 */
  font-variation-settings: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden] {
  display: none;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

.container {
  width: 100%;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

.pointer-events-none {
  pointer-events: none;
}

.static {
  position: static;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.inset-0 {
  inset: 0px;
}

.left-0 {
  left: 0px;
}

.left-1\\/2 {
  left: 50%;
}

.top-10 {
  top: 2.5rem;
}

.top-5 {
  top: 1.25rem;
}

.top-full {
  top: 100%;
}

.z-\\[2147483647\\] {
  z-index: 2147483647;
}

.z-\\[99999\\] {
  z-index: 99999;
}

.z-\\[999\\] {
  z-index: 999;
}

.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.hidden {
  display: none;
}

.w-\\[300px\\] {
  width: 300px;
}

.w-auto {
  width: auto;
}

.w-full {
  width: 100%;
}

.w-screen {
  width: 100vw;
}

.max-w-full {
  max-width: 100%;
}

.-translate-x-1\\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.translate-y-2 {
  --tw-translate-y: 0.5rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.cursor-pointer {
  cursor: pointer;
}

.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}

.flex-row {
  flex-direction: row;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.break-all {
  word-break: break-all;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-sm {
  border-radius: 0.125rem;
}

.border {
  border-width: 1px;
}

.border-b-2 {
  border-bottom-width: 2px;
}

.border-\\[rgba\\(255\\2c 155\\2c 0\\2c 0\\.3\\)\\] {
  border-color: rgba(255,155,0,0.3);
}

.border-\\[rgba\\(255\\2c 200\\2c 50\\2c 0\\.3\\)\\] {
  border-color: rgba(255,200,50,0.3);
}

.border-\\[rgba\\(77\\2c 200\\2c 0\\2c 0\\.3\\)\\] {
  border-color: rgba(77,200,0,0.3);
}

.border-blue-500 {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}

.border-gray-100 {
  --tw-border-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-border-opacity));
}

.border-gray-500 {
  --tw-border-opacity: 1;
  border-color: rgb(107 114 128 / var(--tw-border-opacity));
}

.border-white {
  --tw-border-opacity: 1;
  border-color: rgb(255 255 255 / var(--tw-border-opacity));
}

.bg-\\[rgba\\(120\\2c 170\\2c 210\\2c 0\\.7\\)\\] {
  background-color: rgba(120,170,210,0.7);
}

.bg-sky-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}

.bg-slate-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(203 213 225 / var(--tw-bg-opacity));
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.p-2 {
  padding: 0.5rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.pt-1 {
  padding-top: 0.25rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.italic {
  font-style: italic;
}

.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.underline {
  text-decoration-line: underline;
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\\:border-blue-600:hover {
  --tw-border-opacity: 1;
  border-color: rgb(37 99 235 / var(--tw-border-opacity));
}

.hover\\:bg-\\[\\#f0f0f0\\]:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(240 240 240 / var(--tw-bg-opacity));
}

.hover\\:text-blue-900:hover {
  --tw-text-opacity: 1;
  color: rgb(30 58 138 / var(--tw-text-opacity));
}

.focus\\:ring-1:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}`;
var K = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, st = {}, Ne = {}, Le = {}, E = {};
Object.defineProperty(E, "__esModule", { value: !0 });
E.isObject = E.pick = E.assertNever = void 0;
function Ht(t) {
  throw new Error(`Unexpected value should never occur: ${t}`);
}
E.assertNever = Ht;
function It(t, e) {
  const n = e.map((r) => [r, t == null ? void 0 : t[r]]);
  return Object.fromEntries(n);
}
E.pick = It;
function Ut(t) {
  return typeof t == "object" && t !== null;
}
E.isObject = Ut;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.logLevelSeverity = t.makeConsoleLogger = t.LogLevel = void 0;
  const e = E;
  var n;
  (function(a) {
    a.DEBUG = "debug", a.INFO = "info", a.WARN = "warn", a.ERROR = "error";
  })(n = t.LogLevel || (t.LogLevel = {}));
  function r(a) {
    return (s, d, o) => {
      console[s](`${a} ${s}:`, d, o);
    };
  }
  t.makeConsoleLogger = r;
  function i(a) {
    switch (a) {
      case n.DEBUG:
        return 20;
      case n.INFO:
        return 40;
      case n.WARN:
        return 60;
      case n.ERROR:
        return 80;
      default:
        return (0, e.assertNever)(a);
    }
  }
  t.logLevelSeverity = i;
})(Le);
var De = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.buildRequestError = t.APIResponseError = t.UnknownHTTPResponseError = t.isHTTPResponseError = t.RequestTimeoutError = t.isNotionClientError = t.ClientErrorCode = t.APIErrorCode = void 0;
  const e = E;
  var n;
  (function(p) {
    p.Unauthorized = "unauthorized", p.RestrictedResource = "restricted_resource", p.ObjectNotFound = "object_not_found", p.RateLimited = "rate_limited", p.InvalidJSON = "invalid_json", p.InvalidRequestURL = "invalid_request_url", p.InvalidRequest = "invalid_request", p.ValidationError = "validation_error", p.ConflictError = "conflict_error", p.InternalServerError = "internal_server_error", p.ServiceUnavailable = "service_unavailable";
  })(n = t.APIErrorCode || (t.APIErrorCode = {}));
  var r;
  (function(p) {
    p.RequestTimeout = "notionhq_client_request_timeout", p.ResponseError = "notionhq_client_response_error";
  })(r = t.ClientErrorCode || (t.ClientErrorCode = {}));
  class i extends Error {
  }
  function a(p) {
    return (0, e.isObject)(p) && p instanceof i;
  }
  t.isNotionClientError = a;
  function s(p, f) {
    return a(p) && p.code in f;
  }
  class d extends i {
    constructor(f = "Request to Notion API has timed out") {
      super(f), this.code = r.RequestTimeout, this.name = "RequestTimeoutError";
    }
    static isRequestTimeoutError(f) {
      return s(f, {
        [r.RequestTimeout]: !0
      });
    }
    static rejectAfterTimeout(f, _) {
      return new Promise((ke, se) => {
        const Ee = setTimeout(() => {
          se(new d());
        }, _);
        f.then(ke).catch(se).then(() => clearTimeout(Ee));
      });
    }
  }
  t.RequestTimeoutError = d;
  class o extends i {
    constructor(f) {
      super(f.message), this.name = "HTTPResponseError";
      const { code: _, status: ke, headers: se, rawBodyText: Ee } = f;
      this.code = _, this.status = ke, this.headers = se, this.body = Ee;
    }
  }
  const b = {
    [r.ResponseError]: !0,
    [n.Unauthorized]: !0,
    [n.RestrictedResource]: !0,
    [n.ObjectNotFound]: !0,
    [n.RateLimited]: !0,
    [n.InvalidJSON]: !0,
    [n.InvalidRequestURL]: !0,
    [n.InvalidRequest]: !0,
    [n.ValidationError]: !0,
    [n.ConflictError]: !0,
    [n.InternalServerError]: !0,
    [n.ServiceUnavailable]: !0
  };
  function m(p) {
    return !!s(p, b);
  }
  t.isHTTPResponseError = m;
  class u extends o {
    constructor(f) {
      var _;
      super({
        ...f,
        code: r.ResponseError,
        message: (_ = f.message) !== null && _ !== void 0 ? _ : `Request to Notion API failed with status: ${f.status}`
      }), this.name = "UnknownHTTPResponseError";
    }
    static isUnknownHTTPResponseError(f) {
      return s(f, {
        [r.ResponseError]: !0
      });
    }
  }
  t.UnknownHTTPResponseError = u;
  const y = {
    [n.Unauthorized]: !0,
    [n.RestrictedResource]: !0,
    [n.ObjectNotFound]: !0,
    [n.RateLimited]: !0,
    [n.InvalidJSON]: !0,
    [n.InvalidRequestURL]: !0,
    [n.InvalidRequest]: !0,
    [n.ValidationError]: !0,
    [n.ConflictError]: !0,
    [n.InternalServerError]: !0,
    [n.ServiceUnavailable]: !0
  };
  class $ extends o {
    constructor() {
      super(...arguments), this.name = "APIResponseError";
    }
    static isAPIResponseError(f) {
      return s(f, y);
    }
  }
  t.APIResponseError = $;
  function T(p, f) {
    const _ = oe(f);
    return _ !== void 0 ? new $({
      code: _.code,
      message: _.message,
      headers: p.headers,
      status: p.status,
      rawBodyText: f
    }) : new u({
      message: void 0,
      headers: p.headers,
      status: p.status,
      rawBodyText: f
    });
  }
  t.buildRequestError = T;
  function oe(p) {
    if (typeof p != "string")
      return;
    let f;
    try {
      f = JSON.parse(p);
    } catch {
      return;
    }
    if (!(!(0, e.isObject)(f) || typeof f.message != "string" || !xe(f.code)))
      return {
        ...f,
        code: f.code,
        message: f.message
      };
  }
  function xe(p) {
    return typeof p == "string" && p in y;
  }
})(De);
var c = {};
Object.defineProperty(c, "__esModule", { value: !0 });
c.oauthToken = c.listComments = c.createComment = c.search = c.createDatabase = c.listDatabases = c.queryDatabase = c.updateDatabase = c.getDatabase = c.appendBlockChildren = c.listBlockChildren = c.deleteBlock = c.updateBlock = c.getBlock = c.getPageProperty = c.updatePage = c.getPage = c.createPage = c.listUsers = c.getUser = c.getSelf = void 0;
c.getSelf = {
  method: "get",
  pathParams: [],
  queryParams: [],
  bodyParams: [],
  path: () => "users/me"
};
c.getUser = {
  method: "get",
  pathParams: ["user_id"],
  queryParams: [],
  bodyParams: [],
  path: (t) => `users/${t.user_id}`
};
c.listUsers = {
  method: "get",
  pathParams: [],
  queryParams: ["start_cursor", "page_size"],
  bodyParams: [],
  path: () => "users"
};
c.createPage = {
  method: "post",
  pathParams: [],
  queryParams: [],
  bodyParams: ["parent", "properties", "icon", "cover", "content", "children"],
  path: () => "pages"
};
c.getPage = {
  method: "get",
  pathParams: ["page_id"],
  queryParams: ["filter_properties"],
  bodyParams: [],
  path: (t) => `pages/${t.page_id}`
};
c.updatePage = {
  method: "patch",
  pathParams: ["page_id"],
  queryParams: [],
  bodyParams: ["properties", "icon", "cover", "archived"],
  path: (t) => `pages/${t.page_id}`
};
c.getPageProperty = {
  method: "get",
  pathParams: ["page_id", "property_id"],
  queryParams: ["start_cursor", "page_size"],
  bodyParams: [],
  path: (t) => `pages/${t.page_id}/properties/${t.property_id}`
};
c.getBlock = {
  method: "get",
  pathParams: ["block_id"],
  queryParams: [],
  bodyParams: [],
  path: (t) => `blocks/${t.block_id}`
};
c.updateBlock = {
  method: "patch",
  pathParams: ["block_id"],
  queryParams: [],
  bodyParams: [
    "embed",
    "type",
    "archived",
    "bookmark",
    "image",
    "video",
    "pdf",
    "file",
    "audio",
    "code",
    "equation",
    "divider",
    "breadcrumb",
    "table_of_contents",
    "link_to_page",
    "table_row",
    "heading_1",
    "heading_2",
    "heading_3",
    "paragraph",
    "bulleted_list_item",
    "numbered_list_item",
    "quote",
    "to_do",
    "toggle",
    "template",
    "callout",
    "synced_block",
    "table"
  ],
  path: (t) => `blocks/${t.block_id}`
};
c.deleteBlock = {
  method: "delete",
  pathParams: ["block_id"],
  queryParams: [],
  bodyParams: [],
  path: (t) => `blocks/${t.block_id}`
};
c.listBlockChildren = {
  method: "get",
  pathParams: ["block_id"],
  queryParams: ["start_cursor", "page_size"],
  bodyParams: [],
  path: (t) => `blocks/${t.block_id}/children`
};
c.appendBlockChildren = {
  method: "patch",
  pathParams: ["block_id"],
  queryParams: [],
  bodyParams: ["children", "after"],
  path: (t) => `blocks/${t.block_id}/children`
};
c.getDatabase = {
  method: "get",
  pathParams: ["database_id"],
  queryParams: [],
  bodyParams: [],
  path: (t) => `databases/${t.database_id}`
};
c.updateDatabase = {
  method: "patch",
  pathParams: ["database_id"],
  queryParams: [],
  bodyParams: [
    "title",
    "description",
    "icon",
    "cover",
    "properties",
    "is_inline",
    "archived"
  ],
  path: (t) => `databases/${t.database_id}`
};
c.queryDatabase = {
  method: "post",
  pathParams: ["database_id"],
  queryParams: ["filter_properties"],
  bodyParams: ["sorts", "filter", "start_cursor", "page_size", "archived"],
  path: (t) => `databases/${t.database_id}/query`
};
c.listDatabases = {
  method: "get",
  pathParams: [],
  queryParams: ["start_cursor", "page_size"],
  bodyParams: [],
  path: () => "databases"
};
c.createDatabase = {
  method: "post",
  pathParams: [],
  queryParams: [],
  bodyParams: [
    "parent",
    "properties",
    "icon",
    "cover",
    "title",
    "description",
    "is_inline"
  ],
  path: () => "databases"
};
c.search = {
  method: "post",
  pathParams: [],
  queryParams: [],
  bodyParams: ["sort", "query", "start_cursor", "page_size", "filter"],
  path: () => "search"
};
c.createComment = {
  method: "post",
  pathParams: [],
  queryParams: [],
  bodyParams: ["parent", "rich_text", "discussion_id"],
  path: () => "comments"
};
c.listComments = {
  method: "get",
  pathParams: [],
  queryParams: ["block_id", "start_cursor", "page_size"],
  bodyParams: [],
  path: () => "comments"
};
c.oauthToken = {
  method: "post",
  pathParams: [],
  queryParams: [],
  bodyParams: ["grant_type", "code", "redirect_uri", "external_account"],
  path: () => "oauth/token"
};
var qe = { exports: {} };
(function(t, e) {
  var n = function() {
    if (typeof self < "u")
      return self;
    if (typeof window < "u")
      return window;
    if (typeof K < "u")
      return K;
    throw new Error("unable to locate global object");
  }, r = n();
  t.exports = e = r.fetch, r.fetch && (e.default = r.fetch.bind(r)), e.Headers = r.Headers, e.Request = r.Request, e.Response = r.Response;
})(qe, qe.exports);
var Nt = qe.exports;
const Lt = "@notionhq/client", Dt = "2.2.14", jt = "A simple and easy to use client for the Notion API", Mt = {
  node: ">=12"
}, Bt = "https://developers.notion.com/docs/getting-started", zt = {
  url: "https://github.com/makenotion/notion-sdk-js/issues"
}, Ft = {
  type: "git",
  url: "https://github.com/makenotion/notion-sdk-js/"
}, Kt = [
  "notion",
  "notionapi",
  "rest",
  "notion-api"
], Vt = "./build/src", Wt = "./build/src/index.d.ts", Zt = {
  prepare: "npm run build",
  prepublishOnly: "npm run checkLoggedIn && npm run lint && npm run test",
  build: "tsc",
  prettier: "prettier --write .",
  lint: "prettier --check . && eslint . --ext .ts && cspell '**/*' ",
  test: "jest ./test",
  "check-links": "git ls-files | grep md$ | xargs -n 1 markdown-link-check",
  prebuild: "npm run clean",
  clean: "rm -rf ./build",
  checkLoggedIn: "./scripts/verifyLoggedIn.sh"
}, Gt = "", Jt = "MIT", Yt = [
  "build/package.json",
  "build/src/**"
], Xt = {
  "@types/node-fetch": "^2.5.10",
  "node-fetch": "^2.6.1"
}, Qt = {
  "@types/jest": "^28.1.4",
  "@typescript-eslint/eslint-plugin": "^5.39.0",
  "@typescript-eslint/parser": "^5.39.0",
  cspell: "^5.4.1",
  eslint: "^7.24.0",
  jest: "^28.1.2",
  "markdown-link-check": "^3.8.7",
  prettier: "^2.8.8",
  "ts-jest": "^28.0.5",
  typescript: "^4.8.4"
}, en = {
  name: Lt,
  version: Dt,
  description: jt,
  engines: Mt,
  homepage: Bt,
  bugs: zt,
  repository: Ft,
  keywords: Kt,
  main: Vt,
  types: Wt,
  scripts: Zt,
  author: Gt,
  license: Jt,
  files: Yt,
  dependencies: Xt,
  devDependencies: Qt
};
var S = K && K.__classPrivateFieldSet || function(t, e, n, r, i) {
  if (r === "m")
    throw new TypeError("Private method is not writable");
  if (r === "a" && !i)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? t !== e || !i : !e.has(t))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return r === "a" ? i.call(t, n) : i ? i.value = n : e.set(t, n), n;
}, O = K && K.__classPrivateFieldGet || function(t, e, n, r) {
  if (n === "a" && !r)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? t !== e || !r : !e.has(t))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return n === "m" ? r : n === "a" ? r.call(t) : r ? r.value : e.get(t);
}, ce, he, ue, pe, me, fe, be, ge, ve;
Object.defineProperty(Ne, "__esModule", { value: !0 });
const q = Le, ae = De, h = E, l = c, tn = Nt, Ye = en;
class $e {
  constructor(e) {
    var n, r, i, a, s, d;
    ce.set(this, void 0), he.set(this, void 0), ue.set(this, void 0), pe.set(this, void 0), me.set(this, void 0), fe.set(this, void 0), be.set(this, void 0), ge.set(this, void 0), ve.set(this, void 0), this.blocks = {
      /**
       * Retrieve block
       */
      retrieve: (o) => this.request({
        path: l.getBlock.path(o),
        method: l.getBlock.method,
        query: (0, h.pick)(o, l.getBlock.queryParams),
        body: (0, h.pick)(o, l.getBlock.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Update block
       */
      update: (o) => this.request({
        path: l.updateBlock.path(o),
        method: l.updateBlock.method,
        query: (0, h.pick)(o, l.updateBlock.queryParams),
        body: (0, h.pick)(o, l.updateBlock.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Delete block
       */
      delete: (o) => this.request({
        path: l.deleteBlock.path(o),
        method: l.deleteBlock.method,
        query: (0, h.pick)(o, l.deleteBlock.queryParams),
        body: (0, h.pick)(o, l.deleteBlock.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      children: {
        /**
         * Append block children
         */
        append: (o) => this.request({
          path: l.appendBlockChildren.path(o),
          method: l.appendBlockChildren.method,
          query: (0, h.pick)(o, l.appendBlockChildren.queryParams),
          body: (0, h.pick)(o, l.appendBlockChildren.bodyParams),
          auth: o == null ? void 0 : o.auth
        }),
        /**
         * Retrieve block children
         */
        list: (o) => this.request({
          path: l.listBlockChildren.path(o),
          method: l.listBlockChildren.method,
          query: (0, h.pick)(o, l.listBlockChildren.queryParams),
          body: (0, h.pick)(o, l.listBlockChildren.bodyParams),
          auth: o == null ? void 0 : o.auth
        })
      }
    }, this.databases = {
      /**
       * List databases
       *
       * @deprecated Please use `search`
       */
      list: (o) => this.request({
        path: l.listDatabases.path(),
        method: l.listDatabases.method,
        query: (0, h.pick)(o, l.listDatabases.queryParams),
        body: (0, h.pick)(o, l.listDatabases.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Retrieve a database
       */
      retrieve: (o) => this.request({
        path: l.getDatabase.path(o),
        method: l.getDatabase.method,
        query: (0, h.pick)(o, l.getDatabase.queryParams),
        body: (0, h.pick)(o, l.getDatabase.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Query a database
       */
      query: (o) => this.request({
        path: l.queryDatabase.path(o),
        method: l.queryDatabase.method,
        query: (0, h.pick)(o, l.queryDatabase.queryParams),
        body: (0, h.pick)(o, l.queryDatabase.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Create a database
       */
      create: (o) => this.request({
        path: l.createDatabase.path(),
        method: l.createDatabase.method,
        query: (0, h.pick)(o, l.createDatabase.queryParams),
        body: (0, h.pick)(o, l.createDatabase.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Update a database
       */
      update: (o) => this.request({
        path: l.updateDatabase.path(o),
        method: l.updateDatabase.method,
        query: (0, h.pick)(o, l.updateDatabase.queryParams),
        body: (0, h.pick)(o, l.updateDatabase.bodyParams),
        auth: o == null ? void 0 : o.auth
      })
    }, this.pages = {
      /**
       * Create a page
       */
      create: (o) => this.request({
        path: l.createPage.path(),
        method: l.createPage.method,
        query: (0, h.pick)(o, l.createPage.queryParams),
        body: (0, h.pick)(o, l.createPage.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Retrieve a page
       */
      retrieve: (o) => this.request({
        path: l.getPage.path(o),
        method: l.getPage.method,
        query: (0, h.pick)(o, l.getPage.queryParams),
        body: (0, h.pick)(o, l.getPage.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Update page properties
       */
      update: (o) => this.request({
        path: l.updatePage.path(o),
        method: l.updatePage.method,
        query: (0, h.pick)(o, l.updatePage.queryParams),
        body: (0, h.pick)(o, l.updatePage.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      properties: {
        /**
         * Retrieve page property
         */
        retrieve: (o) => this.request({
          path: l.getPageProperty.path(o),
          method: l.getPageProperty.method,
          query: (0, h.pick)(o, l.getPageProperty.queryParams),
          body: (0, h.pick)(o, l.getPageProperty.bodyParams),
          auth: o == null ? void 0 : o.auth
        })
      }
    }, this.users = {
      /**
       * Retrieve a user
       */
      retrieve: (o) => this.request({
        path: l.getUser.path(o),
        method: l.getUser.method,
        query: (0, h.pick)(o, l.getUser.queryParams),
        body: (0, h.pick)(o, l.getUser.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * List all users
       */
      list: (o) => this.request({
        path: l.listUsers.path(),
        method: l.listUsers.method,
        query: (0, h.pick)(o, l.listUsers.queryParams),
        body: (0, h.pick)(o, l.listUsers.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * Get details about bot
       */
      me: (o) => this.request({
        path: l.getSelf.path(),
        method: l.getSelf.method,
        query: (0, h.pick)(o, l.getSelf.queryParams),
        body: (0, h.pick)(o, l.getSelf.bodyParams),
        auth: o == null ? void 0 : o.auth
      })
    }, this.comments = {
      /**
       * Create a comment
       */
      create: (o) => this.request({
        path: l.createComment.path(),
        method: l.createComment.method,
        query: (0, h.pick)(o, l.createComment.queryParams),
        body: (0, h.pick)(o, l.createComment.bodyParams),
        auth: o == null ? void 0 : o.auth
      }),
      /**
       * List comments
       */
      list: (o) => this.request({
        path: l.listComments.path(),
        method: l.listComments.method,
        query: (0, h.pick)(o, l.listComments.queryParams),
        body: (0, h.pick)(o, l.listComments.bodyParams),
        auth: o == null ? void 0 : o.auth
      })
    }, this.search = (o) => this.request({
      path: l.search.path(),
      method: l.search.method,
      query: (0, h.pick)(o, l.search.queryParams),
      body: (0, h.pick)(o, l.search.bodyParams),
      auth: o == null ? void 0 : o.auth
    }), this.oauth = {
      /**
       * Get token
       */
      token: (o) => this.request({
        path: l.oauthToken.path(),
        method: l.oauthToken.method,
        query: (0, h.pick)(o, l.oauthToken.queryParams),
        body: (0, h.pick)(o, l.oauthToken.bodyParams),
        auth: {
          client_id: o.client_id,
          client_secret: o.client_secret
        }
      })
    }, S(this, ce, e == null ? void 0 : e.auth, "f"), S(this, he, (n = e == null ? void 0 : e.logLevel) !== null && n !== void 0 ? n : q.LogLevel.WARN, "f"), S(this, ue, (r = e == null ? void 0 : e.logger) !== null && r !== void 0 ? r : (0, q.makeConsoleLogger)(Ye.name), "f"), S(this, pe, ((i = e == null ? void 0 : e.baseUrl) !== null && i !== void 0 ? i : "https://api.notion.com") + "/v1/", "f"), S(this, me, (a = e == null ? void 0 : e.timeoutMs) !== null && a !== void 0 ? a : 6e4, "f"), S(this, fe, (s = e == null ? void 0 : e.notionVersion) !== null && s !== void 0 ? s : $e.defaultNotionVersion, "f"), S(this, be, (d = e == null ? void 0 : e.fetch) !== null && d !== void 0 ? d : tn.default, "f"), S(this, ge, e == null ? void 0 : e.agent, "f"), S(this, ve, `notionhq-client/${Ye.version}`, "f");
  }
  /**
   * Sends a request.
   *
   * @param path
   * @param method
   * @param query
   * @param body
   * @returns
   */
  async request({ path: e, method: n, query: r, body: i, auth: a }) {
    this.log(q.LogLevel.INFO, "request start", { method: n, path: e });
    const s = !i || Object.entries(i).length === 0 ? void 0 : JSON.stringify(i), d = new URL(`${O(this, pe, "f")}${e}`);
    if (r)
      for (const [m, u] of Object.entries(r))
        u !== void 0 && (Array.isArray(u) ? u.forEach((y) => d.searchParams.append(m, decodeURIComponent(y))) : d.searchParams.append(m, String(u)));
    let o;
    if (typeof a == "object") {
      const m = `${a.client_id}:${a.client_secret}`;
      o = { authorization: `Basic ${Buffer.from(m).toString("base64")}` };
    } else
      o = this.authAsHeaders(a);
    const b = {
      ...o,
      "Notion-Version": O(this, fe, "f"),
      "user-agent": O(this, ve, "f")
    };
    s !== void 0 && (b["content-type"] = "application/json");
    try {
      const m = await ae.RequestTimeoutError.rejectAfterTimeout(O(this, be, "f").call(this, d.toString(), {
        method: n.toUpperCase(),
        headers: b,
        body: s,
        agent: O(this, ge, "f")
      }), O(this, me, "f")), u = await m.text();
      if (!m.ok)
        throw (0, ae.buildRequestError)(m, u);
      const y = JSON.parse(u);
      return this.log(q.LogLevel.INFO, "request success", { method: n, path: e }), y;
    } catch (m) {
      throw (0, ae.isNotionClientError)(m) && (this.log(q.LogLevel.WARN, "request fail", {
        code: m.code,
        message: m.message
      }), (0, ae.isHTTPResponseError)(m) && this.log(q.LogLevel.DEBUG, "failed response body", {
        body: m.body
      })), m;
    }
  }
  /**
   * Emits a log message to the console.
   *
   * @param level The level for this message
   * @param args Arguments to send to the console
   */
  log(e, n, r) {
    (0, q.logLevelSeverity)(e) >= (0, q.logLevelSeverity)(O(this, he, "f")) && O(this, ue, "f").call(this, e, n, r);
  }
  /**
   * Transforms an API key or access token into a headers object suitable for an HTTP request.
   *
   * This method uses the instance's value as the default when the input is undefined. If neither are defined, it returns
   * an empty object
   *
   * @param auth API key or access token
   * @returns headers key-value object
   */
  authAsHeaders(e) {
    const n = {}, r = e ?? O(this, ce, "f");
    return r !== void 0 && (n.authorization = `Bearer ${r}`), n;
  }
}
Ne.default = $e;
ce = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakMap(), ue = /* @__PURE__ */ new WeakMap(), pe = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap(), be = /* @__PURE__ */ new WeakMap(), ge = /* @__PURE__ */ new WeakMap(), ve = /* @__PURE__ */ new WeakMap();
$e.defaultNotionVersion = "2022-06-28";
var g = {};
Object.defineProperty(g, "__esModule", { value: !0 });
g.isMentionRichTextItemResponse = g.isEquationRichTextItemResponse = g.isTextRichTextItemResponse = g.isFullComment = g.isFullUser = g.isFullPageOrDatabase = g.isFullDatabase = g.isFullPage = g.isFullBlock = g.collectPaginatedAPI = g.iteratePaginatedAPI = void 0;
async function* at(t, e) {
  let n = e.start_cursor;
  do {
    const r = await t({
      ...e,
      start_cursor: n
    });
    yield* r.results, n = r.next_cursor;
  } while (n);
}
g.iteratePaginatedAPI = at;
async function nn(t, e) {
  const n = [];
  for await (const r of at(t, e))
    n.push(r);
  return n;
}
g.collectPaginatedAPI = nn;
function rn(t) {
  return t.object === "block" && "type" in t;
}
g.isFullBlock = rn;
function lt(t) {
  return t.object === "page" && "url" in t;
}
g.isFullPage = lt;
function dt(t) {
  return t.object === "database" && "title" in t;
}
g.isFullDatabase = dt;
function on(t) {
  return t.object === "database" ? dt(t) : lt(t);
}
g.isFullPageOrDatabase = on;
function sn(t) {
  return "type" in t;
}
g.isFullUser = sn;
function an(t) {
  return "created_by" in t;
}
g.isFullComment = an;
function ln(t) {
  return t.type === "text";
}
g.isTextRichTextItemResponse = ln;
function dn(t) {
  return t.type === "equation";
}
g.isEquationRichTextItemResponse = dn;
function cn(t) {
  return t.type === "mention";
}
g.isMentionRichTextItemResponse = cn;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.isFullPageOrDatabase = t.isFullComment = t.isFullUser = t.isFullPage = t.isFullDatabase = t.isFullBlock = t.iteratePaginatedAPI = t.collectPaginatedAPI = t.isNotionClientError = t.RequestTimeoutError = t.UnknownHTTPResponseError = t.APIResponseError = t.ClientErrorCode = t.APIErrorCode = t.LogLevel = t.Client = void 0;
  var e = Ne;
  Object.defineProperty(t, "Client", { enumerable: !0, get: function() {
    return e.default;
  } });
  var n = Le;
  Object.defineProperty(t, "LogLevel", { enumerable: !0, get: function() {
    return n.LogLevel;
  } });
  var r = De;
  Object.defineProperty(t, "APIErrorCode", { enumerable: !0, get: function() {
    return r.APIErrorCode;
  } }), Object.defineProperty(t, "ClientErrorCode", { enumerable: !0, get: function() {
    return r.ClientErrorCode;
  } }), Object.defineProperty(t, "APIResponseError", { enumerable: !0, get: function() {
    return r.APIResponseError;
  } }), Object.defineProperty(t, "UnknownHTTPResponseError", { enumerable: !0, get: function() {
    return r.UnknownHTTPResponseError;
  } }), Object.defineProperty(t, "RequestTimeoutError", { enumerable: !0, get: function() {
    return r.RequestTimeoutError;
  } }), Object.defineProperty(t, "isNotionClientError", { enumerable: !0, get: function() {
    return r.isNotionClientError;
  } });
  var i = g;
  Object.defineProperty(t, "collectPaginatedAPI", { enumerable: !0, get: function() {
    return i.collectPaginatedAPI;
  } }), Object.defineProperty(t, "iteratePaginatedAPI", { enumerable: !0, get: function() {
    return i.iteratePaginatedAPI;
  } }), Object.defineProperty(t, "isFullBlock", { enumerable: !0, get: function() {
    return i.isFullBlock;
  } }), Object.defineProperty(t, "isFullDatabase", { enumerable: !0, get: function() {
    return i.isFullDatabase;
  } }), Object.defineProperty(t, "isFullPage", { enumerable: !0, get: function() {
    return i.isFullPage;
  } }), Object.defineProperty(t, "isFullUser", { enumerable: !0, get: function() {
    return i.isFullUser;
  } }), Object.defineProperty(t, "isFullComment", { enumerable: !0, get: function() {
    return i.isFullComment;
  } }), Object.defineProperty(t, "isFullPageOrDatabase", { enumerable: !0, get: function() {
    return i.isFullPageOrDatabase;
  } });
})(st);
const J = 50;
function je(t) {
  return new st.Client({
    auth: t,
    fetch: (n, r) => fetch(n.replace("https://api.notion.com/v1", "http://localhost:5173/notionapi"), r)
  });
}
async function hn(t, e, n) {
  try {
    const r = await un(
      e,
      n,
      { title: { title: [{ text: { content: document.title } }] } },
      t.slice(0, J)
    );
    if (t.length > J)
      for (let i = J; i < t.length; i += J)
        await pn(e, r.id, t.slice(i, i + J));
    return { success: !0, url: r.url };
  } catch (r) {
    return { success: !1, message: r };
  }
}
async function un(t, e, n, r) {
  return await je(t).pages.create({
    parent: {
      database_id: e
    },
    properties: n,
    children: r
  });
}
async function pn(t, e, n) {
  await je(t).blocks.children.append({
    block_id: e,
    children: n
  });
}
async function mn(t, e) {
  const n = {
    filter: {
      value: "database",
      property: "object"
    },
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time"
    }
  };
  return e && (n.query = e), await je(t).search(n);
}
const fn = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='15'%20height='15'%20viewBox='0%200%2032%2032'%3e%3cpath%20fill='currentColor'%20d='m27.71%209.29l-5-5A1%201%200%200%200%2022%204H6a2%202%200%200%200-2%202v20a2%202%200%200%200%202%202h20a2%202%200%200%200%202-2V10a1%201%200%200%200-.29-.71M12%206h8v4h-8Zm8%2020h-8v-8h8Zm2%200v-8a2%202%200%200%200-2-2h-8a2%202%200%200%200-2%202v8H6V6h4v4a2%202%200%200%200%202%202h8a2%202%200%200%200%202-2V6.41l4%204V26Z'/%3e%3c/svg%3e", bn = "data:image/svg+xml,%3csvg%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.85355%202.14645C5.04882%202.34171%205.04882%202.65829%204.85355%202.85355L3.70711%204H9C11.4853%204%2013.5%206.01472%2013.5%208.5C13.5%2010.9853%2011.4853%2013%209%2013H5C4.72386%2013%204.5%2012.7761%204.5%2012.5C4.5%2012.2239%204.72386%2012%205%2012H9C10.933%2012%2012.5%2010.433%2012.5%208.5C12.5%206.567%2010.933%205%209%205H3.70711L4.85355%206.14645C5.04882%206.34171%205.04882%206.65829%204.85355%206.85355C4.65829%207.04882%204.34171%207.04882%204.14645%206.85355L2.14645%204.85355C1.95118%204.65829%201.95118%204.34171%202.14645%204.14645L4.14645%202.14645C4.34171%201.95118%204.65829%201.95118%204.85355%202.14645Z'%20fill='currentColor'%20fill-rule='evenodd'%20clip-rule='evenodd'%3e%3c/path%3e%3c/svg%3e", gn = "data:image/svg+xml,%3csvg%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M1.84998%207.49998C1.84998%204.66458%204.05979%201.84998%207.49998%201.84998C10.2783%201.84998%2011.6515%203.9064%2012.2367%205H10.5C10.2239%205%2010%205.22386%2010%205.5C10%205.77614%2010.2239%206%2010.5%206H13.5C13.7761%206%2014%205.77614%2014%205.5V2.5C14%202.22386%2013.7761%202%2013.5%202C13.2239%202%2013%202.22386%2013%202.5V4.31318C12.2955%203.07126%2010.6659%200.849976%207.49998%200.849976C3.43716%200.849976%200.849976%204.18537%200.849976%207.49998C0.849976%2010.8146%203.43716%2014.15%207.49998%2014.15C9.44382%2014.15%2011.0622%2013.3808%2012.2145%2012.2084C12.8315%2011.5806%2013.3133%2010.839%2013.6418%2010.0407C13.7469%209.78536%2013.6251%209.49315%2013.3698%209.38806C13.1144%209.28296%2012.8222%209.40478%2012.7171%209.66014C12.4363%2010.3425%2012.0251%2010.9745%2011.5013%2011.5074C10.5295%2012.4963%209.16504%2013.15%207.49998%2013.15C4.05979%2013.15%201.84998%2010.3354%201.84998%207.49998Z'%20fill='currentColor'%20fill-rule='evenodd'%20clip-rule='evenodd'%3e%3c/path%3e%3c/svg%3e";
var vn = Object.defineProperty, yn = Object.getOwnPropertyDescriptor, A = (t, e, n, r) => {
  for (var i = r > 1 ? void 0 : r ? yn(e, n) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (i = (r ? s(e, n, i) : s(i)) || i);
  return r && i && vn(e, n, i), i;
};
let k = class extends R {
  constructor() {
    super(...arguments), this.setNotionKey = () => {
    }, this.options = [], this.key = "", this.selectedOption = null, this.reloadingDatabase = !1;
  }
  firstUpdated() {
    this.key = this.getNotionKey() ?? "";
    const t = this.getClipDatabaseInfo();
    t && (this.selectedOption = t), this.updateDatabaseOptions();
  }
  async updateDatabaseOptions() {
    const e = (await mn(this.key)).results;
    this.options = e.map((n) => ({
      id: n.id,
      name: n.title.map((r) => r.text.content).join(),
      icon: n.icon
    }));
  }
  handleSave() {
    this.setNotionKey(this.key), this.selectedOption && this.setClipDatabaseInfo(this.selectedOption);
  }
  handleSelect(t) {
    this.selectedOption = t, this.handleSave();
  }
  reloadDatabaseOption() {
    this.reloadingDatabase = !0, this.setNotionKey(this.key), this.updateDatabaseOptions().then(() => {
      this.reloadingDatabase = !1;
    });
  }
  render() {
    return U`
      <div class='w-[300px] bg-white flex flex-col gap-2 px-2 py-4'>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold'>Key</div>
          <clipper-ui-input .value=${this.key} .onChangeValue=${(t) => this.key = t} .placeholder=${"Notion Intergration Key"}></clipper-ui-input>
        </div>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold flex flex-row items-center gap-2'>
            Database
            <img src=${gn} @click=${this.reloadDatabaseOption} class="${this.reloadingDatabase ? "animate-spin" : ""} cursor-pointer" />
          </div>
          <clipper-ui-selector .placeholder=${"Select an database"} .selectedOption=${this.selectedOption} .onSelect=${(t) => this.handleSelect(t)} .options=${this.options}></clipper-ui-selector>
        </div>
        <div class='flex flex-row gap-2 items-center justify-center px-2 py-1'>
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1' @click=${this.handleSave}>
            <img src=${fn} />
            Save
          </button> 
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1' @click=${this.handleReset}>
            <img src=${bn} />
            Reset
          </button> 
        </div>
      </div>
    `;
  }
};
k.styles = [W(ie)];
A([
  w({ type: Function })
], k.prototype, "setNotionKey", 2);
A([
  w({ type: Function })
], k.prototype, "getNotionKey", 2);
A([
  w({ type: Function })
], k.prototype, "getClipDatabaseInfo", 2);
A([
  w({ type: Function })
], k.prototype, "setClipDatabaseInfo", 2);
A([
  w({ type: Function })
], k.prototype, "handleReset", 2);
A([
  C()
], k.prototype, "options", 2);
A([
  C()
], k.prototype, "key", 2);
A([
  C()
], k.prototype, "selectedOption", 2);
A([
  C()
], k.prototype, "reloadingDatabase", 2);
k = A([
  re("clipper-config")
], k);
var wn = Object.defineProperty, _n = Object.getOwnPropertyDescriptor, Ce = (t, e, n, r) => {
  for (var i = r > 1 ? void 0 : r ? _n(e, n) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (i = (r ? s(e, n, i) : s(i)) || i);
  return r && i && wn(e, n, i), i;
};
let V = class extends R {
  constructor() {
    super(...arguments), this.label = null, this.value = "";
  }
  handleInput(t) {
    const e = t.target;
    this.onChangeValue(e.textContent ?? "");
  }
  render() {
    return U`
      <div class='border shadow-sm rounded-md focus:ring-1 p-2 w-full text-sm whitespace-nowrap overflow-hidden' contenteditable="true" @input=${this.handleInput} >
        ${this.value}
      </div>
    `;
  }
};
V.styles = W(ie);
Ce([
  w({ type: String })
], V.prototype, "label", 2);
Ce([
  w({ type: String })
], V.prototype, "value", 2);
Ce([
  w({ type: Function })
], V.prototype, "onChangeValue", 2);
V = Ce([
  re("clipper-ui-input")
], V);
var Pn = Object.defineProperty, $n = Object.getOwnPropertyDescriptor, Z = (t, e, n, r) => {
  for (var i = r > 1 ? void 0 : r ? $n(e, n) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (i = (r ? s(e, n, i) : s(i)) || i);
  return r && i && Pn(e, n, i), i;
};
let N = class extends R {
  constructor() {
    super(...arguments), this.options = [], this.selectedOption = null, this.placeholder = "", this.isOpen = !1;
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  handleOptionClick(t) {
    this.selectedOption = t, this.isOpen = !1, this.onSelect(t);
  }
  optionIcon(t) {
    return t.icon && t.icon.type === "emoji" ? t.icon.emoji : null;
  }
  computedIcon(t) {
    return t.icon && t.icon.type === "emoji" ? t.icon.emoji : "";
  }
  render() {
    const t = this.options.map((r) => this.computedIcon(r)), e = this.selectedOption && this.selectedOption.name || this.placeholder, n = this.selectedOption ? this.computedIcon(this.selectedOption) : "";
    return U`
      <div class="relative w-full p-2 text-sm border rounded-md cursor-pointer focus:ring-1 shadow-sm">
        <div class='flex flex-row items-center justify-between' @click="${this.toggleDropdown}">
          <div>${n} ${e}</div>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </div>
        <div class="${this.isOpen ? "" : "hidden"} absolute top-full shadow-sm translate-y-2 left-0 w-full overflow-y-auto border bg-white rounded-md">
          ${this.options.map(
      (r, i) => U`<div class="p-2 cursor-pointer hover:bg-[#f0f0f0]" @click="${() => this.handleOptionClick(r)}">${t[i]} ${r.name}</div>`
    )}
        </div>
      </div>
    `;
  }
};
N.styles = W(ie);
Z([
  w({ type: Array })
], N.prototype, "options", 2);
Z([
  w()
], N.prototype, "selectedOption", 2);
Z([
  w({ type: String })
], N.prototype, "placeholder", 2);
Z([
  w({ type: Function })
], N.prototype, "onSelect", 2);
Z([
  C()
], N.prototype, "isOpen", 2);
N = Z([
  re("clipper-ui-selector")
], N);
const Cn = "data:image/svg+xml,%3csvg%20width='15'%20height='15'%20viewBox='0%200%2015%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.5%201C4.22386%201%204%201.22386%204%201.5C4%201.77614%204.22386%202%204.5%202H12V13H4.5C4.22386%2013%204%2013.2239%204%2013.5C4%2013.7761%204.22386%2014%204.5%2014H12C12.5523%2014%2013%2013.5523%2013%2013V2C13%201.44772%2012.5523%201%2012%201H4.5ZM6.60355%204.89645C6.40829%204.70118%206.09171%204.70118%205.89645%204.89645C5.70118%205.09171%205.70118%205.40829%205.89645%205.60355L7.29289%207H0.5C0.223858%207%200%207.22386%200%207.5C0%207.77614%200.223858%208%200.5%208H7.29289L5.89645%209.39645C5.70118%209.59171%205.70118%209.90829%205.89645%2010.1036C6.09171%2010.2988%206.40829%2010.2988%206.60355%2010.1036L8.85355%207.85355C9.04882%207.65829%209.04882%207.34171%208.85355%207.14645L6.60355%204.89645Z'%20fill='currentColor'%20fill-rule='evenodd'%20clip-rule='evenodd'%3e%3c/path%3e%3c/svg%3e";
var xn = Object.defineProperty, kn = Object.getOwnPropertyDescriptor, ct = (t, e, n, r) => {
  for (var i = r > 1 ? void 0 : r ? kn(e, n) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (i = (r ? s(e, n, i) : s(i)) || i);
  return r && i && xn(e, n, i), i;
};
const ht = "clipper-ui-toaster";
let _e = class extends R {
  constructor() {
    super(...arguments), this.toasts = [], this.showToast = (t, e) => {
      const n = { key: t, message: e };
      this.toasts = [...this.toasts, n];
    }, this.updateToast = (t, e, n, r = 3e3) => {
      const i = { key: t, message: e, url: n, duration: r };
      this.toasts = this.toasts.map((a) => a.key === t ? (setTimeout(() => {
        this.toasts = this.toasts.filter((s) => s.key !== t);
      }, i.duration), i) : a);
    };
  }
  renderLink(t) {
    return t ? U`<a href=${t} class='inline-flex items-center gap-2 justify-center whitespace-nowrap cursor-pointer text-sm font-medium hover:text-blue-900 mx-1 px-1 pt-1 mb-1 border-b-2 border-white hover:border-blue-600 transition-all'>
                  <img src=${Cn}>
                  Open
                </a>
              ` : v;
  }
  render() {
    return U`
      <div class="fixed top-5 w-screen z-[2147483647] flex flex-col gap-2 justify-center items-center select-none">
        ${this.toasts.map(
      ({ message: t, url: e }) => U`<div class="shadow-lg transition-all duration-400 items-center justify-center px-4 py-2 flex border border-gray-100 flex-row gap-2 rounded-lg bg-white text-black">
                  <div>${t}</div>
                  ${this.renderLink(e)}
                </div>`
    )}
      </div>
      `;
  }
};
_e.styles = W(ie);
ct([
  C()
], _e.prototype, "toasts", 2);
_e = ct([
  re(ht)
], _e);
function En() {
  return document.querySelector(ht);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const An = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Sn = (t) => (...e) => ({ _$litDirective$: t, values: e });
let On = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, n, r) {
    this._$Ct = e, this._$AM = n, this._$Ci = r;
  }
  _$AS(e, n) {
    return this.update(e, n);
  }
  update(e, n) {
    return this.render(...n);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut = "important", Rn = " !" + ut, le = Sn(class extends On {
  constructor(t) {
    var e;
    if (super(t), t.type !== An.ATTRIBUTE || t.name !== "style" || ((e = t.strings) == null ? void 0 : e.length) > 2)
      throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, n) => {
      const r = t[n];
      return r == null ? e : e + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(t, [e]) {
    const { style: n } = t.element;
    if (this.ut === void 0)
      return this.ut = new Set(Object.keys(e)), this.render(e);
    for (const r of this.ut)
      e[r] == null && (this.ut.delete(r), r.includes("-") ? n.removeProperty(r) : n[r] = null);
    for (const r in e) {
      const i = e[r];
      if (i != null) {
        this.ut.add(r);
        const a = typeof i == "string" && i.endsWith(Rn);
        r.includes("-") || a ? n.setProperty(r, a ? i.slice(0, -11) : i, a ? ut : "") : n[r] = i;
      }
    }
    return B;
  }
});
function Tn() {
  return {
    paragraph: { rich_text: [{ type: "text", text: { content: `
` } }] }
  };
}
const qn = ["#text", "P", "A", "IMG", "BR", "B", "STRONG"];
function Hn(t) {
  if (!qn.includes(t.nodeName) || t.textContent === "")
    return;
  let e = "";
  return t.nodeName === "#text" ? e = t.textContent ?? "" : t.nodeName === "BR" && (e = `
`), {
    text: {
      content: e
    }
  };
}
function In(t) {
  const e = {
    text: {
      content: t.textContent
    }
  }, n = t.getAttribute("href");
  return n && (e.text.link = { url: n }), e;
}
function Un(t, e) {
  let n = null;
  return t ? n = Object.assign({}, t) : n = {
    bold: !1,
    italic: !1,
    strikethrough: !1,
    underline: !1,
    code: !1,
    color: "default"
  }, e.tagName === "B" || e.tagName === "STRONG" ? n.bold = !0 : e.tagName === "I" ? n.italic = !0 : e.tagName === "CODE" && (n.code = !0), n;
}
function L(t, e, n) {
  var a;
  const r = t.childNodes;
  if (!r || r.length <= 0) {
    const s = Hn(t);
    return s ? (n && (s.annotations = n), [s]) : void 0;
  } else if (t.tagName === "A") {
    const s = In(t);
    return s ? (n && (s.annotations = n), [s]) : void 0;
  }
  let i = [];
  for (let s = 0; s < r.length; s++) {
    const d = r[s];
    e || (e = t.tagName === "CODE" && ((a = t.parentElement) == null ? void 0 : a.tagName) === "PRE");
    let o = null;
    if (e)
      o = L(d, e);
    else {
      const b = Un(n, t);
      o = L(d, e, b);
    }
    o && (i = [...i, ...o]);
  }
  return i;
}
function Nn(t) {
  return {
    bulleted_list_item: {
      rich_text: L(t)
    }
  };
}
function Ln(t) {
  let e = "";
  return t.classList.forEach((n) => {
    n.startsWith("language-") ? e = n.replace("language-", "") : n.startsWith("lang-") && (e = n.replace("lang-", ""));
  }), e === "" && (e = t.getAttribute("data-lang") ?? ""), e = e.toLowerCase(), e === "ts" ? e = "typescript" : e === "js" ? e = "javascript" : e === "text" && (e = "plain text"), {
    code: {
      rich_text: L(t),
      language: e
    }
  };
}
function Dn(t) {
  return {
    equation: { expression: t.getAttribute("data-tex") }
  };
}
function jn(t) {
  const e = {}, r = `heading_${Number(t.tagName.replace("H", ""))}`;
  return e[r] = { rich_text: L(t) }, e;
}
function Mn(t) {
  let e = t.src;
  return e.startsWith("data:image") && (e = t.getAttribute("data-actualsrc") ?? ""), {
    image: {
      external: {
        url: e
      }
    }
  };
}
function Xe(t) {
  const e = t.getAttribute("href") ?? null;
  return {
    paragraph: { rich_text: [{ type: "text", text: { content: t.textContent ?? e, link: { url: e } } }] }
  };
}
function Bn(t) {
  return {
    numbered_list_item: {
      rich_text: L(t)
    }
  };
}
function zn(t) {
  return {
    paragraph: { rich_text: L(t) }
  };
}
function Fn(t) {
  return {
    quote: { rich_text: L(t) }
  };
}
function Kn(t) {
  var e, n, r;
  if (t instanceof HTMLParagraphElement)
    return t.childElementCount === 1 && ((e = t.firstElementChild) == null ? void 0 : e.tagName) === "A" ? Xe(t.firstElementChild) : zn(t);
  if (t instanceof HTMLImageElement)
    return Mn(t);
  if (t instanceof HTMLHeadingElement)
    return jn(t);
  if (t.tagName === "BLOCKQUOTE")
    return Fn(t);
  if (t.tagName === "BR")
    return Tn();
  if (t instanceof HTMLLinkElement)
    return Xe(t);
  if (t.tagName === "CODE")
    return Ln(t);
  if (t.tagName === "SPAN" && t.getAttribute("data-tex"))
    return Dn(t);
  if (t.tagName === "LI") {
    if (((n = t.parentElement) == null ? void 0 : n.tagName) === "UL")
      return Nn(t);
    if (((r = t.parentElement) == null ? void 0 : r.tagName) === "OL")
      return Bn(t);
  }
}
function Vn(t) {
  const e = [];
  function n(r) {
    const i = Kn(r);
    if (i) {
      e.push(i);
      return;
    }
    const a = r.children;
    for (let s = 0; s < a.length; s++) {
      const d = a[s];
      n(d);
    }
  }
  return n(t), e;
}
var Wn = Object.defineProperty, Zn = Object.getOwnPropertyDescriptor, x = (t, e, n, r) => {
  for (var i = r > 1 ? void 0 : r ? Zn(e, n) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (i = (r ? s(e, n, i) : s(i)) || i);
  return r && i && Wn(e, n, i), i;
};
function Gn(t, e) {
  return window.getComputedStyle(t).getPropertyValue(e);
}
function Te(t, e) {
  const n = [];
  for (const r of e)
    n.push(Gn(t, r));
  return n;
}
let P = class extends R {
  constructor() {
    super(...arguments), this.toggleHotKey = "KeyQ", this.levelUpHotKey = "KeyW", this.levelDownHotKey = "KeyS", this.positionCssMap = {
      container: {},
      margin: {},
      border: {},
      padding: {}
    }, this.hoveredElement = null, this.hoveredHistoryElement = [], this.infoClassName = "", this.showInspectContainer = !1, this.isClipping = !1, this.enableInspect = !1, this.preUserSelect = "", this.toaster = void 0, this.renderCover = () => {
      if (!this.hoveredElement) {
        this.showInspectContainer = !1, document.body.style.userSelect = this.preUserSelect, this.preUserSelect = "";
        return;
      }
      this.showInspectContainer = !0, this.preUserSelect || (this.preUserSelect = getComputedStyle(document.body).userSelect), document.body.style.userSelect = "none";
      const t = this.hoveredElement, { top: e, right: n, bottom: r, left: i } = t.getBoundingClientRect(), [a, s, d, o] = Te(t, ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"]), [b, m, u, y] = Te(t, ["padding-top", "padding-right", "padding-bottom", "padding-left"]), [$, T, oe, xe] = Te(t, ["margin-top", "margin-right", "margin-bottom", "margin-left"]);
      this.positionCssMap = {
        container: {
          "--top": `${e}px`,
          "--left": `${i}px`,
          "--bottom": `${r}px`,
          "--right": `${n}px`,
          "--mt": $,
          "--mr": T,
          "--mb": oe,
          "--ml": xe,
          "--bt": a,
          "--br": s,
          "--bb": d,
          "--bl": o,
          "--pt": b,
          "--pr": m,
          "--pb": u,
          "--pl": y,
          top: "calc(var(--top) - var(--mt))",
          left: "calc(var(--left) - var(--ml))",
          height: "calc(var(--bottom) - var(--top) + var(--mb) + var(--mt))",
          width: "calc(var(--right) - var(--left) + var(--mr) + var(--ml))"
        },
        margin: {
          "border-width": "var(--mt) var(--mr) var(--mb) var(--ml)"
        },
        border: {
          "border-width": "var(--bt) var(--br) var(--bb) var(--bl)"
        },
        padding: {
          "border-width": "var(--pt) var(--pr) var(--pb) var(--pl)"
        }
      };
      const f = document.documentElement.clientHeight - r - Number(oe.replace("px", "")), _ = e - Number($.replace("px", ""));
      this.infoClassName = _ > f ? _ < 100 ? "element-info-top-inner" : "element-info-top" : f < 100 ? "element-info-bottom-inner" : "element-info-bottom";
    }, this.removeHoveredElement = () => {
      this.hoveredElement = null, this.hoveredHistoryElement = [];
    }, this.handleMouseMove = (t) => {
      if (this.enableInspect) {
        const e = t.target;
        e === this.hoveredElement || (this.hoveredElement = e, this.hoveredHistoryElement = []);
      } else
        this.removeHoveredElement();
    }, this.handleMouseClick = (t) => {
      var e, n;
      if (this.enableInspect && this.showInspectContainer) {
        t.stopPropagation(), t.preventDefault(), console.log(this.hoveredElement), this.isClipping = !0;
        const r = Date.now().toString();
        (e = this.toaster) == null || e.showToast(r, "✂  Clipping...");
        const i = Vn(this.hoveredElement), a = (n = this.getClipDatabaseInfo()) == null ? void 0 : n.id;
        a && hn(i, this.getNotionKey(), a).then(({ success: s, url: d }) => {
          var o, b;
          s ? (o = this.toaster) == null || o.updateToast(r, "✅ Clip Success", d) : (b = this.toaster) == null || b.updateToast(r, "❌ Clip Failed");
        }), this.hoveredElement = null, this.enableInspect = !1;
      }
    }, this.handleClickSwitch = (t) => {
      t.preventDefault(), t.stopPropagation(), this.enableInspect = !this.enableInspect;
    }, this.handleHotKeyPress = (t) => {
      t.code === this.toggleHotKey && (this.enableInspect = !0);
    }, this.handleHotKeyDown = (t) => {
      if (t.code === this.levelUpHotKey && this.hoveredElement) {
        const e = this.hoveredElement.parentElement;
        e && (this.hoveredHistoryElement.push(this.hoveredElement), this.hoveredElement = e);
      }
      if (t.code === this.levelDownHotKey && this.hoveredElement) {
        const e = this.hoveredHistoryElement.at(-1);
        e ? (this.hoveredElement = e, this.hoveredHistoryElement.pop()) : this.hoveredElement = this.hoveredElement.children[0] ?? this.hoveredElement;
      }
    }, this.handleHotKeyUp = (t) => {
      t.code === this.toggleHotKey && (this.enableInspect = !1);
    };
  }
  willUpdate(t) {
    t.has("hoveredElement") && this.renderCover();
  }
  registerHotKey() {
    document.addEventListener("keypress", this.handleHotKeyPress), document.addEventListener("keydown", this.handleHotKeyDown), document.addEventListener("keyup", this.handleHotKeyUp);
  }
  unregisterHotKey() {
    document.removeEventListener("keypress", this.handleHotKeyPress), document.removeEventListener("keydown", this.handleHotKeyDown), document.removeEventListener("keyup", this.handleHotKeyUp);
  }
  registerInspector() {
    window.addEventListener("mousemove", this.handleMouseMove), document.addEventListener("click", this.handleMouseClick, !0), document.addEventListener("mouseleave", this.removeHoveredElement);
  }
  unregisterInspector() {
    window.removeEventListener("mousemove", this.handleMouseMove), document.removeEventListener("click", this.handleMouseClick, !0), document.removeEventListener("mouseleave", this.removeHoveredElement);
  }
  firstUpdated() {
    this.toaster = En(), this.registerInspector(), this.registerHotKey();
  }
  disconnectedCallback() {
    this.unregisterInspector(), this.unregisterHotKey();
  }
  render() {
    var t;
    return U`
      <div
        class="pointer-events-none transition-all fixed z-[99999] border border-blue-500 rounded-sm ${this.hoveredElement ? "block" : "hidden"}"
        style=${le(this.positionCssMap.container)}
      >
        <div class="border-[rgba(255,155,0,0.3)] absolute inset-0" style=${le(this.positionCssMap.margin)}>
          <div class="border-[rgba(255,200,50,0.3)] absolute inset-0" style=${le(this.positionCssMap.border)}>
            <div class="border-[rgba(77,200,0,0.3)] absolute inset-0" style=${le(this.positionCssMap.padding)}>
              <div class="bg-[rgba(120,170,210,0.7)] absolute inset-0"></div>
            </div>
          </div>
        </div>
        <div
          class="absolute ${this.infoClassName} left-1/2 -translate-x-1/2"
        >
          <div class="max-w-full text-sm bg-sky-600 text-white break-all shadow py-1 px-2 rounded">
            Click to Clip ${(t = this.hoveredElement) == null ? void 0 : t.className}
          </div>
        </div>
      </div>
      <!-- <div
        id="inspector-switch"
        @click="${this.handleClickSwitch}"
        class="fixed z-[999] p-2 rounded-full shadow-lg border-gray-500 top-10 left-1/2 -translate-x-1/2 cursor-pointer bg-slate-300 border flex"
      >
        Inspect: ${this.enableInspect}
      </div> -->
    `;
  }
};
P.styles = [
  pt`
        .element-info-top {
          top: -4px;
          transform: translateY(-100%);
        }
        .element-info-bottom {
          top: calc(100% + 4px);
        }
        .element-info-top-inner {
          top: 4px;
        }
        .element-info-bottom-inner {
          bottom: 4px;
        }
      `,
  W(ie)
];
x([
  w()
], P.prototype, "toggleHotKey", 2);
x([
  w()
], P.prototype, "levelUpHotKey", 2);
x([
  w()
], P.prototype, "levelDownHotKey", 2);
x([
  w()
], P.prototype, "getNotionKey", 2);
x([
  w()
], P.prototype, "getClipDatabaseInfo", 2);
x([
  C()
], P.prototype, "positionCssMap", 2);
x([
  C()
], P.prototype, "hoveredElement", 2);
x([
  C()
], P.prototype, "infoClassName", 2);
x([
  C()
], P.prototype, "showInspectContainer", 2);
x([
  C()
], P.prototype, "isClipping", 2);
x([
  C()
], P.prototype, "enableInspect", 2);
x([
  C()
], P.prototype, "preUserSelect", 2);
P = x([
  re("dom-inspector")
], P);
const Xn = "__freeclip__key__", Qn = "__freeclip__databaseId__";
export {
  Qn as CLIP_DATABASE_INFO,
  k as ClipperConfig,
  V as ClipperUiInput,
  N as ClipperUiSelector,
  _e as ClipperUiToaster,
  P as DomInspector,
  Xn as NOTION_KEY,
  En as useToaster
};
