import { readRecording, readState, formatPath } from "./model.js";
import { initialLanguage, localizeReadingLinks } from "../preferences.js";
import { PIN } from "./pin.js";

const copy = {
  en: {
    skip: "Skip to the comparison",
    back: "/ Engineering notes",
    eyebrow: "GRAPHQL / THE SHAPE OF FAILURE",
    title: "One failed lookup.\nHow much disappears?",
    lead: "The inventory lookup for one product fails. That does not yet tell us which other values will survive.",
    context:
      "The same three synthetic products pass through a real Apollo Gateway and three HTTP subgraphs. Compare the recorded responses from three choices of batch error handling and field nullability.",
    recordLabel:
      "Recorded HTTP responses · Synthetic lookup failure · No live store",
    compareTitle: "One valid query. Three failure boundaries.",
    perKey: "Fail one key",
    wholeBatch: "Fail the batch",
    nonNull: "Make the field required",
    responseCaption: "A visual reading of the recorded JSON response.",
    pathsTitle: "Where did the error land?",
    pathsHelp:
      "The failed lookup key is always demo-lamp. Error paths identify the affected response positions; they are not a count of independent root causes.",
    rawLabel: "Inspect the gateway response",
    decisionLabel: "THE DECISION, AND ITS COST",
    decisionTitle: "Should product details survive an inventory failure?",
    decisionBody:
      "Nullable availability keeps the name and price available, but the client must represent unknown inventory. With Availability!, every non-null product has an availability value. In this schema, an inventory failure instead makes the whole product null—including details that were fetched successfully.",
    tradeoff:
      "Per-key errors keep the other keys useful when failures can be attributed to individual lookups. They cannot turn a failed database-wide request into trustworthy partial success. The error boundary has to match what the backend actually knows.",
    clientLimit:
      "All three schemas compose, the query validates against each, and every response is HTTP 200. A client library may still discard partial data according to its own error policy. This experiment observes the gateway response, not a client library's rendering behavior.",
    fullNote: "Read the design and error-cache tradeoff →",
    provenance: "From key to response path.",
    source:
      "The source checker compares input keys, representations, batch keys, subgraph errors, gateway paths and preserved values. This page checks the published recording hash and derives its cards from that response. Neither check authenticates the recording host.",
    rawFile: "Original recorded response bundle",
    sourceLink: "Source for this recording",
    typesLink: "Related: a valid query with stale generated types",
    cacheLink: "Next: why does a cache read have no error?",
    hashLabel: "Raw recording SHA-256",
    home: "← All engineering notes",
    footer: "An independent experiment by Minjae Lee.",
    verified: "Recording hash verified",
    failed: "Recording unavailable",
    error:
      "The published recording could not be verified. No result is displayed. Read the design note below.",
    missing:
      "This product is null. Its name, price and merchant do not survive in the gateway response.",
    unknownStock: "Inventory unknown",
    soldOut: "Sold out",
    inStock: "In stock",
    units: "units",
    products: "products retained",
    stocks: "inventory values known",
    explanations: {
      "nullable-per-key":
        "Return an Error for the lamp key. Its availability becomes null; all three products and the other two inventory values survive.",
      "nullable-whole-batch":
        "Throw from the entire batch. One failed lookup rejects all three inventory loads. Product names, prices and merchants still survive.",
      "non-null-per-key":
        "Keep the per-key error, but require Availability!. The lamp cannot satisfy that promise. The whole lamp product becomes null; the other two products survive.",
    },
  },
  ko: {
    skip: "비교 화면으로 건너뛰기",
    back: "/ 엔지니어링 노트",
    eyebrow: "GRAPHQL / 실패가 지우는 범위",
    title: "재고 조회 하나가 실패했는데,\n상품까지 사라졌습니다.",
    lead: "상품 하나의 재고를 읽지 못했습니다. 그렇다고 응답에서 어떤 값이 사라질지까지 정해진 것은 아닙니다.",
    context:
      "같은 가상 상품 세 개를 실제 Apollo Gateway와 세 HTTP 서브그래프로 조회했습니다. 배치의 오류 처리 방식과 재고 필드의 null 허용 여부를 바꿔, 응답에 남는 값을 비교합니다.",
    recordLabel: "실제 HTTP 응답 기록 · 가상의 조회 오류 · 상점 서비스 아님",
    compareTitle: "유효한 쿼리, 서로 다른 실패 범위",
    perKey: "키 하나만 실패",
    wholeBatch: "배치 전체 실패",
    nonNull: "재고를 필수로 선언",
    responseCaption: "기록된 JSON 응답을 카드로 읽어보는 화면입니다.",
    pathsTitle: "오류는 어느 위치로 전달됐을까요?",
    pathsHelp:
      "실패를 일으킨 조회 키는 모두 demo-lamp입니다. 오류 경로는 영향을 받은 응답 위치입니다. 경로가 세 개라고 원인도 세 개인 것은 아닙니다.",
    rawLabel: "게이트웨이 응답 원본 보기",
    decisionLabel: "선택과 그 대가",
    decisionTitle: "재고 조회가 실패해도 상품 정보는 남길까요?",
    decisionBody:
      "재고에 null을 허용하면 상품명과 가격은 남지만, 클라이언트는 재고를 확인하지 못한 상태를 처리해야 합니다. Availability!로 선언하면 null이 아닌 상품에는 재고 값도 존재합니다. 대신 이 스키마에서는 재고 조회 하나의 실패로 상품 전체가 null이 됩니다. 정상적으로 읽은 상품명과 가격도 함께 사라집니다.",
    tradeoff:
      "실패한 키를 구분할 수 있다면 키별 오류로 나머지 값을 살릴 수 있습니다. 하지만 저장소 전체 조회가 실패했는데 일부 값만 성공한 것처럼 만들 수는 없습니다. 서버가 실제로 아는 범위에 맞춰 오류를 돌려줘야 합니다.",
    clientLimit:
      "세 조건 모두 스키마 합성과 쿼리 검증을 통과하고 HTTP 200을 반환했습니다. 클라이언트 라이브러리는 자체 오류 정책에 따라 부분 데이터를 버릴 수도 있습니다. 이 실험에서 관측한 대상은 게이트웨이 응답이며, 클라이언트의 렌더링 동작은 아닙니다.",
    fullNote: "설계와 오류 캐시의 차이까지 읽기 →",
    provenance: "조회 키에서 응답 경로까지",
    source:
      "소스의 검사기는 입력 키, representation, 배치 키, 서브그래프 오류, 게이트웨이 경로와 남은 값을 대조합니다. 이 화면은 공개된 기록의 해시를 확인한 뒤 응답에서 카드를 만듭니다. 어느 쪽도 실행 환경의 신뢰성을 인증하는 검사는 아닙니다.",
    rawFile: "원본 응답 기록 전체",
    sourceLink: "실행 당시 소스",
    typesLink: "함께 읽기: 쿼리는 유효하지만 생성 타입은 오래됐다면",
    cacheLink: "다음 실험: 캐시로 조회하면 오류는 어디로 갈까?",
    hashLabel: "원본 실행 기록 SHA-256",
    home: "← 전체 엔지니어링 노트",
    footer: "이민재의 독립적인 개인 실험입니다.",
    verified: "실행 기록 해시 확인 완료",
    failed: "실행 기록 확인 불가",
    error:
      "공개된 기록을 검증하지 못해 결과를 표시하지 않습니다. 아래 설계 노트에서 내용을 확인할 수 있습니다.",
    missing:
      "상품 객체가 null입니다. 상품명·가격·판매자도 게이트웨이 응답에 남지 않습니다.",
    unknownStock: "재고 확인 불가",
    soldOut: "품절",
    inStock: "재고 있음",
    units: "개",
    products: "남은 상품",
    stocks: "확인된 재고",
    explanations: {
      "nullable-per-key":
        "램프 키에만 Error를 반환합니다. 램프의 재고는 null이 되지만, 상품 세 개와 나머지 두 재고 값은 남습니다.",
      "nullable-whole-batch":
        "배치 함수 전체에서 예외를 던집니다. 하나의 실패로 재고 조회 세 개가 모두 거절됩니다. 상품명·가격·판매자는 남습니다.",
      "non-null-per-key":
        "키별 오류는 그대로 두고 재고를 Availability!로 선언합니다. 램프는 이 약속을 지키지 못해 상품 전체가 null이 됩니다. 나머지 상품 두 개는 남습니다.",
    },
  },
};
const state = readState(location.search);
state.lang = initialLanguage(location.search);
let recording;
let failed = false;
const $ = (id) => document.getElementById(id);
const node = (tag, text, className) => {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
};
function render() {
  localizeReadingLinks(document, state.lang);
  const t = copy[state.lang];
  document.documentElement.lang = state.lang;
  $("raw").setAttribute("aria-label", t.rawLabel);
  document.title = `${t.title.replaceAll("\n", " ")} — Minjae Lee`;
  document.querySelectorAll("[data-copy]").forEach((item) => {
    item.textContent = t[item.dataset.copy];
  });
  document
    .querySelectorAll("[data-language]")
    .forEach((item) =>
      item.setAttribute(
        "aria-pressed",
        String(item.dataset.language === state.lang),
      ),
    );
  document
    .querySelectorAll("[data-case]")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item.dataset.case === state.id)),
    );
  $("cases").setAttribute(
    "aria-label",
    state.lang === "ko" ? "기록된 오류 처리 조건" : "Recorded policy",
  );
  $("explanation").textContent = t.explanations[state.id];
  $("explanation").hidden = !recording;
  document.querySelector('[data-copy="responseCaption"]').hidden = !recording;
  $("integrity").textContent = failed ? t.failed : recording ? t.verified : "…";
  document.querySelector(".policy-line").hidden = !recording;
  document.querySelector(".error-inspector").hidden = !recording;
  $("raw-detail").hidden = !recording;
  $("recording-hash").closest("details").hidden = !recording;
  document.querySelectorAll("[data-case]").forEach((button) => {
    button.disabled = failed;
  });
  $("design-link").href =
    `https://github.com/minjae-lee-kr/federated-catalog-lab/blob/${PIN.docsRevision}/docs/batch-failure${state.lang === "ko" ? ".ko" : ""}.md`;
  $("source-link").href =
    `https://github.com/minjae-lee-kr/federated-catalog-lab/tree/${PIN.revision}`;
  if (!recording) {
    if (failed)
      $("products").replaceChildren(node("p", t.error, "recording-error"));
    return;
  }
  const view = recording.project(state.id);
  $("field-type").textContent =
    `availability: ${view.fixture.availabilityType}`;
  $("batch-mode").textContent = view.fixture.failureMode;
  $("http-status").textContent = `HTTP ${view.response.status}`;
  $("products").replaceChildren(
    ...view.products.map((product, index) => {
      const card = node(
        "article",
        undefined,
        `product-card${product === null ? " missing" : ""}`,
      );
      card.append(node("span", `products[${index}]`, "position"));
      if (product === null) {
        card.append(node("h3", "null"), node("p", t.missing));
        return card;
      }
      const illustration = node("img", undefined, "product-illustration");
      illustration.src = {
        "demo-notebook": "notebook.svg",
        "demo-lamp": "lamp.svg",
        "demo-ceramic": "cup.svg",
      }[product.sku];
      illustration.alt = "";
      illustration.width = 160;
      illustration.height = 110;
      card.append(
        illustration,
        node("h3", product.name),
        node(
          "p",
          new Intl.NumberFormat(state.lang === "ko" ? "ko-KR" : "en-US", {
            style: "currency",
            currency: product.price.currency,
          }).format(product.price.amountMinor / 100),
          "price",
        ),
        node(
          "p",
          `${product.merchant.name} / ${product.merchant.city}`,
          "merchant",
        ),
      );
      const stock = node(
        "div",
        undefined,
        `stock${product.availability === null ? " unknown" : ""}`,
      );
      if (product.availability === null)
        stock.append(node("span", t.unknownStock), node("code", "null"));
      else
        stock.append(
          node(
            "strong",
            product.availability.quantity === 0 ? t.soldOut : t.inStock,
          ),
          node("span", `${product.availability.quantity} ${t.units}`),
        );
      card.append(stock);
      return card;
    }),
  );
  $("products").setAttribute("aria-busy", "false");
  $("counts").textContent =
    `${t.products}: ${view.productCount}/3 · ${t.stocks}: ${view.inventoryCount}/3`;
  $("paths").replaceChildren(
    ...view.paths.map((path) => node("code", formatPath(path))),
  );
  $("pointer").textContent = view.pointer;
  $("raw").textContent = JSON.stringify(view.response.body, null, 2);
  $("source-link").href =
    `https://github.com/minjae-lee-kr/federated-catalog-lab/tree/${recording.revision}`;
  $("recording-hash").textContent = recording.hash;
}
function update() {
  history.replaceState(
    null,
    "",
    `?${new URLSearchParams({ case: state.id, lang: state.lang })}${location.hash}`,
  );
  render();
}
document.querySelectorAll("[data-language]").forEach((button) =>
  button.addEventListener("click", () => {
    state.lang = button.dataset.language;
    try {
      localStorage.setItem("minjae.portfolio.language", state.lang);
    } catch {
      /* Optional storage. */
    }
    update();
  }),
);
document.querySelectorAll("[data-case]").forEach((button) =>
  button.addEventListener("click", () => {
    state.id = button.dataset.case;
    update();
  }),
);
window.addEventListener("popstate", () => {
  Object.assign(state, readState(location.search));
  state.lang = initialLanguage(location.search);
  render();
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  const next = initialLanguage(location.search);
  if (next === state.lang) return;
  state.lang = next;
  update();
});
render();
try {
  const response = await fetch(new URL("./recording.json", import.meta.url), {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Recording HTTP ${response.status}`);
  recording = await readRecording(new Uint8Array(await response.arrayBuffer()));
} catch (error) {
  failed = true;
  $("products").setAttribute("aria-busy", "false");
  console.error("Batch-failure recording unavailable:", error);
}
render();
