const words = {
  en: {
    disclosure: "Interactive illustrations · not live experiments",
    tabs: ["Recovery", "Verification", "Cancellation"],
    tabLabel: "Explore an engineering question",
    recorded: "Inspect the real recorded run",
    receipt: {
      project: "INTENT / RECOVERY",
      title: "No response. Should you retry?",
      body: "In this example, the reservation committed before the reply was lost. The client still needs evidence of that outcome.",
      action: "Look up the original request",
      reset: "Reset example",
      boundary:
        "The original outcome is retained here. An absent lookup would leave the result unknown.",
      client: "Client",
      journal: "Journal",
      lost: "Reply lost",
      paper: "RESERVATION STATUS",
      unknown: "Outcome unknown",
      confirmed: "Reservation confirmed",
      before: "The missing reply cannot tell you what was committed.",
      after:
        "The lookup returns the original receipt. No new reservation was requested.",
      identity: "Request identity",
      identityValue: "Unchanged",
      result: "Client knowledge",
      uncertain: "Unknown",
      recovered: "Outcome recovered",
      announcement:
        "The original receipt was recovered. The reservation is confirmed.",
    },
    check: {
      project: "VERIFIED CHANGE",
      title: "Who decided what “passed” means?",
      body: "Same code, different verdict. The result depends on who gets to choose the checking rules.",
      action: "Compare with fixed compiler options",
      reset: "Return to candidate settings",
      boundary:
        "This closes the configuration route shown here. Source-level suppression remains a separate policy boundary.",
      excerpt: "SAME PARAMETER EXCERPT",
      candidate: "Candidate-controlled options",
      independent: "Independent options",
      candidateOptions: "strict: true · noCheck: true",
      independentOptions: "strict: true · noCheck omitted",
      empty: "0 reported type errors",
      errors: "2 implicit-any errors",
      emptyDetail: "Type checking was skipped as configured.",
      errorDetail:
        "method and status need explicit types. Approval is refused.",
      caption: "Recorded results from two TypeScript processes.",
    },
    cancellation: {
      project: "CANCELLATION DEBT",
      title: "Timed out. Is the work finished?",
      body: "This work ignores cancellation. Ending the caller’s wait leaves the underlying operation running.",
      boundary:
        "The protected policy keeps its permit until the work settles. Cooperative cancellation is a separate behavior in the recorded comparison.",
      slider: "Move through the sequence",
      wait: "Caller’s wait",
      work: "Physical work",
      permit: "Permit",
      held: "Held",
      released: "Released",
      starts: "Start",
      waitEnds: "Wait ends",
      settles: "Work settles",
      caption:
        "Positions show sequence, not elapsed time or measured performance.",
      phases: [
        "The work starts. Its permit is held.",
        "The caller stops waiting. The work is still running.",
        "The caller has left. The work still holds its permit.",
        "The work settles. Its permit can now be released.",
      ],
    },
  },
  ko: {
    disclosure: "설명용 예제 · 실제 실험을 실행하지 않습니다",
    tabs: ["예약 복구", "검사 기준", "요청 취소"],
    tabLabel: "살펴볼 설계 질문",
    recorded: "실제 실행 기록 살펴보기",
    receipt: {
      project: "INTENT / RECOVERY",
      title: "응답이 없으면 다시 요청해도 될까요?",
      body: "예약은 저장됐지만 응답이 도착하지 않았습니다. 새로 예약하기 전에, 처음 요청한 결과부터 확인합니다.",
      action: "기존 요청의 결과 조회",
      reset: "처음 상태로",
      boundary:
        "결과가 보관된 경우의 예제입니다. 조회 결과가 없으면 예약 여부를 단정할 수 없습니다.",
      client: "클라이언트",
      journal: "저장된 기록",
      lost: "응답 유실",
      paper: "클라이언트의 예약 상태",
      unknown: "예약 여부 미확인",
      confirmed: "예약 완료 확인",
      before: "응답을 받지 못했으므로 예약 성공과 실패를 구분할 수 없습니다.",
      after:
        "기존 예약 기록을 찾았습니다. 새 예약을 만들지 않고 결과를 확인했습니다.",
      identity: "요청 식별자",
      identityValue: "기존 값 유지",
      result: "확인 상태",
      uncertain: "미확인",
      recovered: "확인 완료",
      announcement: "기존 예약 기록을 찾았습니다. 예약 완료를 확인했습니다.",
    },
    check: {
      project: "VERIFIED CHANGE",
      title: "타입 검사를 생략해도 ‘통과’일까요?",
      body: "수정 코드에 포함된 설정은 타입 검사를 생략합니다. 같은 코드에 별도로 정한 검사 기준을 적용해 봅니다.",
      action: "별도로 정한 검사 기준 적용",
      reset: "코드에 포함된 설정으로",
      boundary:
        "검사 설정을 별도로 고정하는 예제입니다. 코드 안의 @ts-nocheck 지시문을 금지하려면 별도 규칙이 필요합니다.",
      excerpt: "두 검사에 사용한 동일 코드 · 일부 발췌",
      candidate: "수정 코드에 포함된 검사 설정",
      independent: "수정 코드와 별도로 정한 설정",
      candidateOptions: "strict: true · noCheck: true",
      independentOptions: "strict: true · noCheck 생략",
      empty: "보고된 타입 오류 0개",
      errors: "암묵적 any 오류 2개",
      emptyDetail: "설정에 따라 타입 검사를 생략했습니다.",
      errorDetail: "method와 status의 타입이 빠졌습니다. 승인을 거부합니다.",
      caption: "별도로 실행한 TypeScript 검사 결과입니다.",
    },
    cancellation: {
      project: "CANCELLATION DEBT",
      title: "타임아웃이면 작업도 끝난 걸까요?",
      body: "이 작업은 취소 신호를 무시합니다. 호출자가 기다리기를 멈춰도 실제 작업은 계속됩니다.",
      boundary:
        "작업이 끝날 때까지 실행 슬롯을 점유하는 정책입니다. 취소 신호로 작업을 중단하는 방식은 실행 기록에서 따로 비교합니다.",
      slider: "단계별 상태 확인",
      wait: "호출자의 대기",
      work: "실제 작업",
      permit: "실행 슬롯",
      held: "점유 중",
      released: "반환",
      starts: "시작",
      waitEnds: "대기 종료",
      settles: "작업 종료",
      caption:
        "단계별 상태를 설명하는 그림입니다. 막대 길이는 실제 시간을 나타내지 않습니다.",
      phases: [
        "작업을 시작하고 실행 슬롯 하나를 점유합니다.",
        "호출자는 대기를 멈췄지만 작업은 계속됩니다.",
        "대기는 끝났어도 실행 슬롯은 아직 점유 중입니다.",
        "작업이 끝나면 실행 슬롯을 반환합니다.",
      ],
    },
  },
};

let instance = 0;

/** A fixed explanatory model. It performs no requests or experiment execution. */
export function mountWorkbench(root, { language = "en" } = {}) {
  if (!root?.ownerDocument)
    throw new TypeError("A workbench mount element is required.");
  const doc = root.ownerDocument;
  const id = `wb-${++instance}`;
  let locale = language === "ko" ? "ko" : "en";
  let active = 0;
  let revealed = false;
  let independent = false;
  let phase = 1;
  let destroyed = false;
  const bindings = [];
  const cleanups = [];
  const el = (tag, className, text) => {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const bind = (node, text) => {
    bindings.push(() => {
      node.textContent = text(words[locale]);
    });
    return node;
  };
  const on = (node, event, listener) => {
    node.addEventListener(event, listener);
    cleanups.push(() => node.removeEventListener(event, listener));
  };
  const shell = el("div", "wb");
  const toolbar = el("div", "wb-toolbar");
  const tablist = el("div", "wb-tabs");
  tablist.setAttribute("role", "tablist");
  const tabs = [];
  const panels = [];
  const panelStack = el("div", "wb-panels");
  const panelBodies = [];
  const kinds = ["receipt", "check", "cancellation"];
  const destinations = [
    "evidence/intent/",
    "evidence/change/",
    "evidence/cancellation/",
  ];
  for (const [index, kind] of kinds.entries()) {
    const tab = el("button", "wb-tab");
    tab.type = "button";
    tab.id = `${id}-tab-${kind}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `${id}-panel-${kind}`);
    const number = el("span", "wb-tab-number", `0${index + 1}`);
    number.setAttribute("aria-hidden", "true");
    tab.append(
      number,
      bind(el("span"), (t) => t.tabs[index]),
    );
    on(tab, "click", () => {
      active = index;
      announce.textContent = "";
      render();
    });
    on(tab, "keydown", (event) => {
      const next =
        event.key === "ArrowRight"
          ? (index + 1) % 3
          : event.key === "ArrowLeft"
            ? (index + 2) % 3
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? 2
                : null;
      if (next === null) return;
      event.preventDefault();
      active = next;
      announce.textContent = "";
      render();
      tabs[next].focus();
    });
    tabs.push(tab);
    tablist.append(tab);
    const panel = el("div", `wb-panel wb-panel-${kind}`);
    panel.id = `${id}-panel-${kind}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;
    const copy = el("div", "wb-copy");
    copy.append(
      bind(el("p", "wb-project"), (t) => t[kind].project),
      bind(el("h3"), (t) => t[kind].title),
      bind(el("p", "wb-body"), (t) => t[kind].body),
    );
    const link = bind(el("a", "wb-record-link"), (t) => `${t.recorded} ↗`);
    link.href = destinations[index];
    const footer = el("div", "wb-panel-footer");
    footer.append(
      bind(el("p", "wb-boundary"), (t) => t[kind].boundary),
      link,
    );
    const visual = el("div", "wb-visual");
    panel.append(copy, visual, footer);
    panels.push(panel);
    panelBodies.push({ visual });
    panelStack.append(panel);
  }

  const announce = el("p", "wb-sr");
  announce.setAttribute("role", "status");
  announce.setAttribute("aria-atomic", "true");
  const receiptButton = bind(el("button", "wb-action"), (t) =>
    revealed ? t.receipt.reset : t.receipt.action,
  );
  receiptButton.type = "button";
  receiptButton.setAttribute("aria-controls", `${id}-receipt`);
  on(receiptButton, "click", () => {
    revealed = !revealed;
    render();
    announce.textContent = revealed
      ? words[locale].receipt.announcement
      : words[locale].receipt.before;
  });
  const route = el("div", "wb-route");
  route.append(
    bind(el("span"), (t) => t.receipt.client),
    bind(el("span", "wb-lost"), (t) => `×  ${t.receipt.lost}`),
    bind(el("span"), (t) => t.receipt.journal),
  );
  const receipt = el("div", "wb-receipt");
  receipt.id = `${id}-receipt`;
  const receiptTitle = bind(el("strong", "wb-receipt-title"), (t) =>
    revealed ? t.receipt.confirmed : t.receipt.unknown,
  );
  const receiptDetail = bind(el("p", "wb-receipt-detail"), (t) =>
    revealed ? t.receipt.after : t.receipt.before,
  );
  const ledger = el("dl", "wb-receipt-lines");
  ledger.append(
    bind(el("dt"), (t) => t.receipt.identity),
    bind(el("dd"), (t) => t.receipt.identityValue),
    bind(el("dt"), (t) => t.receipt.result),
    bind(el("dd"), (t) =>
      revealed ? t.receipt.recovered : t.receipt.uncertain,
    ),
  );
  receipt.append(
    bind(el("p", "wb-paper-label"), (t) => t.receipt.paper),
    receiptTitle,
    receiptDetail,
    ledger,
  );
  panelBodies[0].visual.append(route, receipt, receiptButton);

  const checkButton = bind(el("button", "wb-action"), (t) =>
    independent ? t.check.reset : t.check.action,
  );
  checkButton.type = "button";
  on(checkButton, "click", () => {
    independent = !independent;
    render();
    announce.textContent = independent
      ? words[locale].check.errorDetail
      : words[locale].check.emptyDetail;
  });
  const code = el("div", "wb-code-sheet");
  code.id = `${id}-policy`;
  checkButton.setAttribute("aria-controls", code.id);
  code.append(bind(el("p", "wb-paper-label"), (t) => t.check.excerpt));
  const excerpt = el("pre", "wb-code");
  const codeText = el("code");
  codeText.append(
    doc.createTextNode("export function mayRetry(\n  "),
    el("span", "wb-parameter", "method"),
    doc.createTextNode(", "),
    el("span", "wb-parameter", "status"),
    doc.createTextNode("\n) { /* … */ }"),
  );
  excerpt.append(codeText);
  const policy = el("div", "wb-policy");
  policy.append(
    bind(el("span", "wb-policy-label"), (t) =>
      independent ? t.check.independent : t.check.candidate,
    ),
    bind(el("code", "wb-options"), (t) =>
      independent ? t.check.independentOptions : t.check.candidateOptions,
    ),
  );
  const verdict = el("div", "wb-check-verdict");
  verdict.append(
    bind(el("strong"), (t) => (independent ? t.check.errors : t.check.empty)),
    bind(el("p"), (t) =>
      independent ? t.check.errorDetail : t.check.emptyDetail,
    ),
  );
  code.append(excerpt, policy, verdict);
  panelBodies[1].visual.append(
    code,
    checkButton,
    bind(el("p", "wb-caption"), (t) => t.check.caption),
  );

  const timeline = el("div", "wb-timeline");
  const lane = (key, className) => {
    const row = el("div", "wb-lane");
    const track = el("div", `wb-track ${className}`);
    track.setAttribute("aria-hidden", "true");
    track.append(el("span", "wb-bar"), el("span", "wb-cursor"));
    row.append(
      bind(el("span", "wb-lane-label"), (t) => t.cancellation[key]),
      track,
    );
    return row;
  };
  const axis = el("div", "wb-axis");
  axis.setAttribute("aria-hidden", "true");
  for (const key of ["starts", "waitEnds", "settles"])
    axis.append(bind(el("span"), (t) => t.cancellation[key]));
  const permit = el("div", "wb-permit");
  permit.append(
    bind(el("span"), (t) => t.cancellation.permit),
    bind(el("strong"), (t) =>
      phase < 3 ? t.cancellation.held : t.cancellation.released,
    ),
  );
  timeline.append(
    axis,
    lane("wait", "wb-wait-track"),
    lane("work", "wb-work-track"),
    permit,
  );
  const rangeLabel = bind(
    el("label", "wb-range-label"),
    (t) => t.cancellation.slider,
  );
  rangeLabel.htmlFor = `${id}-sequence`;
  const range = el("input", "wb-range");
  range.type = "range";
  range.id = `${id}-sequence`;
  range.min = "0";
  range.max = "3";
  range.step = "1";
  range.value = String(phase);
  range.setAttribute("aria-describedby", `${id}-time-note`);
  on(range, "input", () => {
    phase = Math.max(0, Math.min(3, Math.round(Number(range.value))));
    render();
  });
  const phaseText = bind(
    el("p", "wb-phase"),
    (t) => t.cancellation.phases[phase],
  );
  const timeNote = bind(el("p", "wb-caption"), (t) => t.cancellation.caption);
  timeNote.id = `${id}-time-note`;
  panelBodies[2].visual.append(
    timeline,
    rangeLabel,
    range,
    phaseText,
    timeNote,
  );
  // The native slider keeps its label beside the result it controls.

  let lastActive = active;
  let panelAnimation;
  function render() {
    if (destroyed) return;
    shell.lang = locale;
    bindings.forEach((apply) => apply());
    tablist.setAttribute("aria-label", words[locale].tabLabel);
    tablist.style.setProperty("--wb-tab-index", String(active));
    tabs.forEach((tab, index) => {
      tab.setAttribute("aria-selected", String(index === active));
      tab.tabIndex = index === active ? 0 : -1;
      panels[index].hidden = index !== active;
      panels[index].inert = index !== active;
    });
    if (active !== lastActive) {
      panelAnimation?.cancel();
      const reduceMotion = doc.defaultView?.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reduceMotion && panels[active].animate) {
        panelAnimation = panels[active].animate(
          [{ opacity: 0.45 }, { opacity: 1 }],
          { duration: 160, easing: "ease-out" },
        );
      }
      lastActive = active;
    }
    receipt.dataset.revealed = String(revealed);
    code.dataset.independent = String(independent);
    timeline.style.setProperty("--wb-progress", `${(phase / 3) * 100}%`);
    timeline.dataset.settled = String(phase === 3);
    // History restoration can change a native control without an input event.
    range.value = String(phase);
    range.setAttribute(
      "aria-valuetext",
      words[locale].cancellation.phases[phase],
    );
  }
  toolbar.append(
    tablist,
    bind(el("p", "wb-disclosure"), (t) => t.disclosure),
  );
  shell.append(toolbar, panelStack, announce);
  root.append(shell);
  render();
  return {
    setLanguage(next) {
      if (destroyed || (next !== "ko" && next !== "en")) return;
      locale = next;
      announce.textContent = "";
      render();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      panelAnimation?.cancel();
      cleanups.forEach((cleanup) => cleanup());
      shell.remove();
    },
  };
}
