export const copy = {
  ko: {
    back: "/ Engineering notes",
    language: "언어",
    skip: "실험 기록으로 이동",
    eyebrow: "REACT / 재확인에 실패한 화면",
    title: "재고는 3개. 그런데 확인은 실패했습니다.",
    lead: "재고를 다시 조회했지만 실패했습니다. 화면에는 3개가 남았습니다. 같은 캐시를 읽자 오류마저 사라졌습니다. 그 사이 서버에 보낸 요청은 없었습니다.",
    context:
      "가상의 상품 목록을 React useQuery로 표시했습니다. 먼저 정상 응답을 받은 뒤, 같은 컴포넌트에서 재고 조회를 실패시키고 캐시를 다시 읽었습니다. 아래에서 오류 처리 정책 두 가지를 비교할 수 있습니다. 남아 있는 3개가 실제 현재 재고와 같은지는 이 기록으로 알 수 없습니다.",
    recorded:
      "개인 실험 · 실제 HTTP와 React DOM 기록 · 저장된 결과를 읽는 화면",
    compare: "같은 실패, 다른 화면",
    policy: "오류 처리 정책",
    policyNone: "none · 실패 응답의 부분 데이터 제외",
    policyAll: "all · 부분 데이터와 오류 함께 수용",
    steps: "읽는 순서",
    warm: "1. 정상 조회",
    failed: "2. 재확인 실패",
    "cache-first": "3. 캐시 다시 읽기",
    checking: "기록 검증 중",
    verified: "기록 바이트·소스 확인",
    unavailable: "기록을 확인하지 못했습니다",
    loading: "원본 기록과 소스 정보를 대조하고 있습니다.",
    loadError:
      "검증된 기록을 불러오지 못해 결과를 표시하지 않습니다. 새로고침 후 다시 확인해 주세요.",
    display: "화면에 표시한 재고",
    quantity: "개",
    absent: "값 없음 (undefined)",
    nullValue: "확인 불가 (null)",
    noError: "오류 없음",
    yes: "있음",
    no: "없음",
    http: "이번 단계 HTTP",
    hookError: "hook.error",
    previous: "hook.previousData",
    errorData: "hook.error.data",
    promise: "명령의 Promise",
    resolved: "이행 (resolved)",
    rejected: "거부 (rejected)",
    initial: "초기 useQuery · 명령 없음",
    status: "networkStatus / dataState",
    noneFailed:
      "errorPolicy: none에서는 실패 응답을 data에 넣지 않았습니다. 하지만 화면의 data까지 비워지지는 않았습니다. 이전 정상 조회의 3개가 남았고, 이번 실패 응답의 null은 error.data에 있었습니다.",
    allFailed:
      "errorPolicy: all에서는 실패 응답의 부분 데이터를 받아들였습니다. 다른 상품은 보이지만 조명의 재고는 null입니다. 이전 정상 데이터는 previousData에 있고, Promise는 오류를 포함한 결과로 이행됐습니다.",
    cacheNote:
      "새 HTTP 요청은 0개입니다. 오류가 사라지고 networkStatus가 7이 됐지만, 재고를 새로 확인한 것은 아닙니다. 여기서 complete는 데이터를 완전히 읽을 수 있는지에 관한 상태이며 최신 재고의 보증이 아닙니다.",
    warmNote:
      "정상 응답으로 조명 재고 3개를 받았습니다. 이 단계를 먼저 두어, 빈 캐시의 최초 실패와 이전 데이터가 있는 재확인 실패를 구분했습니다.",
    detail: "선택한 단계의 원본 값과 DOM 기록",
    raw: "선택한 단계 JSON",
    designTitle: "값을 남길 것인가, 실패를 남길 것인가",
    designIntro:
      "오류 처리 정책 하나로 화면의 의미까지 결정되지는 않았습니다. 재고처럼 다음 행동에 영향을 주는 값이라면, 무엇을 표시할지와 무엇을 믿게 할지를 따로 결정해야 합니다.",
    choice1: "기존 값을 계속 보여주기",
    cost1:
      "목록이 사라지지 않아 사용자가 비교하던 맥락을 유지할 수 있습니다. 대신 재확인 실패를 따로 남기지 않으면, 오래된 3개가 방금 확인된 값처럼 읽힐 수 있습니다.",
    choice2: "확인할 수 없는 값을 null로 보여주기",
    cost2:
      "이번 응답이 알려주지 못한 부분을 드러냅니다. 대신 이전에 알고 있던 값을 화면에서 잃습니다. null을 품절이나 0으로 바꾸면 확인 실패를 다른 사실로 둔갑시키게 됩니다.",
    choice3: "조회 시도의 상태를 별도로 보관하기",
    cost3:
      "마지막 성공과 최근 실패를 나눠 표시하는 설계를 고려할 수 있습니다. 그만큼 상품·계정이 바뀔 때의 초기화와 늦게 도착한 응답 처리도 책임져야 합니다. 이 기록은 그 설계의 운영 검증이 아닙니다.",
    methodTitle: "어디까지 확인했나",
    method:
      "정책마다 새 클라이언트와 캐시를 만들고, 각 사례 안에서는 같은 useQuery 컴포넌트를 유지했습니다. 두 번째·세 번째 단계는 hook이 만든 observable.reobserve를 호출합니다. 일반적인 refetch 호출을 시험한 것은 아닙니다.",
    dom: "useLayoutEffect에서 실제 DOM을 읽었습니다. 연속해서 같은 DOM은 한 번만 보관했으므로, 기록 개수는 렌더·커밋·페인트 횟수가 아닙니다. 여기는 저장된 관측 결과를 옮겨 보여주는 읽기 화면입니다.",
    limits:
      "React 19.3.1 · Apollo Client 4.3.3 · production 빌드 · StrictMode 꺼짐. Suspense, SSR, remount, 변수 변경, 동시 요청과 다른 버전의 동작은 이 실험으로 확인하지 않았습니다.",
    provenance: "실행 환경과 소스",
    provenanceRaw: "기록 출처 JSON",
    readMore: "판단과 재현 방법 더 읽기",
    notes: "설계 노트 · 한국어",
    source: "실험 소스 · 고정 리비전",
    rawLink: "전체 원본 기록 · JSON",
    prior: "앞선 실험 · query와 캐시",
    next: "후속 구현 · 늦게 도착한 응답과 캐시 쓰기",
    pending: "공개 소스 연결 준비 중",
    legend:
      "data는 현재 hook이 돌려준 데이터, previousData는 hook이 별도로 제공한 이전 데이터입니다. error.data는 실패 응답에 포함된 부분 데이터입니다. 세 값은 서로 바꿔 읽을 수 없습니다.",
  },
  en: {
    back: "/ Engineering notes",
    language: "Language",
    skip: "Skip to the recording",
    eyebrow: "REACT / A FAILED RECHECK",
    title: "Stock: 3. The recheck failed.",
    lead: "The inventory recheck failed. The screen still showed 3. Reading the same cache then cleared the error—without sending another request.",
    context:
      "A React useQuery component displays synthetic products. It receives a healthy response, encounters an inventory failure, then reads its cache again. Compare two error policies below. This recording does not establish whether the retained 3 matches current stock.",
    recorded:
      "Personal experiment · Actual HTTP and React DOM observations · Recorded results",
    compare: "Same failure, different screen",
    policy: "Error policy",
    policyNone: "none · Exclude partial data from the failed response",
    policyAll: "all · Accept partial data alongside errors",
    steps: "Reading order",
    warm: "1. Healthy lookup",
    failed: "2. Failed recheck",
    "cache-first": "3. Read cache again",
    checking: "Checking recording",
    verified: "Recording bytes and source checked",
    unavailable: "Recording unavailable",
    loading: "Checking the original bytes and source provenance.",
    loadError:
      "The recording could not be verified. Results are hidden. Please reload to try again.",
    display: "Inventory shown on screen",
    quantity: "units",
    absent: "Absent (undefined)",
    nullValue: "Unknown (null)",
    noError: "No error",
    yes: "Present",
    no: "Absent",
    http: "HTTP requests in this step",
    hookError: "hook.error",
    previous: "hook.previousData",
    errorData: "hook.error.data",
    promise: "Command Promise",
    resolved: "Resolved",
    rejected: "Rejected",
    initial: "Initial useQuery · no command",
    status: "networkStatus / dataState",
    noneFailed:
      "With errorPolicy: none, the failed response did not replace data. That did not empty the screen: data still held 3 from the earlier successful lookup. The failed response’s null was in error.data.",
    allFailed:
      "With errorPolicy: all, the partial response became data. Other products remain visible, but the lamp’s inventory is null. The earlier healthy data is in previousData, and the Promise resolves with a result containing an error.",
    cacheNote:
      "There are zero new HTTP requests. The error clears and networkStatus becomes 7, but inventory was not checked again. Here, complete describes data completeness; it does not guarantee fresh stock.",
    warmNote:
      "A healthy response first returned 3 units for the lamp. Warming the cache distinguishes a failed recheck from an initial failure with no prior data.",
    detail: "Raw values and DOM observation for this step",
    raw: "Selected step JSON",
    designTitle: "Keep the value, or keep the failure?",
    designIntro:
      "An error policy did not determine what the screen would imply. For a value that informs a user’s next action, what to display and what to let the user rely on are separate decisions.",
    choice1: "Keep showing the earlier value",
    cost1:
      "The list remains stable and users keep their comparison context. Without a separate indication of the failed recheck, the old 3 can look like a newly confirmed value.",
    choice2: "Show the unconfirmed field as null",
    cost2:
      "This exposes what the latest response could not provide, at the cost of removing a previously known value. Translating null into zero or sold out would turn a failed lookup into a different claim.",
    choice3: "Track the lookup attempt separately",
    cost3:
      "A design could preserve the last success alongside the latest failure. It must then handle resets when the product or account changes, and late responses. This recording does not validate that design in operation.",
    methodTitle: "What this experiment establishes",
    method:
      "Each policy starts with a fresh client and cache. Within each case, the same useQuery component stays mounted. Steps two and three call observable.reobserve on the hook-created observable. This is not a test of ordinary refetch.",
    dom: "useLayoutEffect reads the actual DOM. Adjacent identical DOM snapshots are deduplicated, so their count is not a render, commit, or paint count. This page presents those saved observations; it does not rerun React.",
    limits:
      "React 19.3.1 · Apollo Client 4.3.3 · production build · StrictMode off. Suspense, SSR, remounts, variable changes, concurrent requests and other versions were not tested here.",
    provenance: "Execution environment and source",
    provenanceRaw: "Recording provenance JSON",
    readMore: "Read the decisions and reproduction steps",
    notes: "Design notes · English",
    source: "Experiment source · pinned revision",
    rawLink: "Full raw recording · JSON",
    prior: "Earlier experiment · query and cache",
    next: "Follow-up · Late responses and guarded cache writes",
    pending: "Public source link pending",
    legend:
      "data is the hook’s current data. previousData is the previous data the hook exposes separately. error.data is partial data from the failed response. These fields are not interchangeable.",
  },
};
