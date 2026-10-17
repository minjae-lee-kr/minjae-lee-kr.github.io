export const copy = {
  ko: {
    reactFollowup: "React 후속 실험: 재확인 실패 뒤 화면에는 무엇이 남을까요? →",
    skip: "조회 결과 비교로 건너뛰기",
    back: "/ 엔지니어링 노트",
    language: "언어",
    eyebrow: "APOLLO CLIENT / 오류 이후의 캐시",
    title: "다음 조회에는\n왜 오류가 없을까?",
    lead: "재고 조회에서 부분 데이터와 오류를 함께 받았습니다. 같은 쿼리를 cache-first로 다시 실행하자 오류는 없었고 HTTP 요청도 0건이었습니다. 첫 응답의 null이 그대로 반환됐습니다.",
    context:
      "정상 응답과 램프 재고 오류를 각각 만드는 로컬 Apollo Gateway를 띄우고, 게이트웨이마다 세 HTTP 서브그래프를 연결했습니다. 조건마다 새 클라이언트·캐시를 사용하고, 그 안의 연속 조회에서는 같은 인스턴스를 유지합니다. 이 화면은 저장된 관측을 비교하며 React UI를 실행하지 않습니다.",
    recorded:
      "가상 상품 · Apollo Client 4.3.3 / GraphQL 16.14.2 · 저장된 실행 기록",
    compare: "오류를 받은 조회와, 그다음 조회",
    controls: "캐시와 오류 정책 조건",
    policyHelp:
      "errorPolicy는 오류와 부분 데이터를 어떻게 받을지 정합니다. fetchPolicy는 캐시와 서버 중 어디서 읽을지 정합니다. cache-first는 필요한 필드가 캐시에 있으면 HTTP 요청 없이 반환합니다. 저장된 null도 필드 값이며, 캐시 누락과는 다릅니다.",
    cold: "빈 캐시",
    warm: "정상 응답을 보관한 캐시",
    noCache: "첫 응답 저장 안 함",
    startCold: "시작: 빈 캐시",
    startWarm: "시작: 정상 HTTP 응답으로 채운 캐시 · 램프 수량 3",
    sameClient:
      "같은 클라이언트·캐시를 유지하며 client.query를 다시 호출합니다. 대상은 계속 오류 서버입니다.",
    failedStep: "01 · 재고 오류가 있는 서버 조회",
    nextStep: "02 · 다음 cache-first 조회",
    promise: "Promise 결과",
    resolved: "반환됨",
    rejected: "오류로 거절",
    result: "반환된 램프 재고",
    noResult: "정상 반환 데이터 없음",
    nullValue: "null · 재고 확인 불가",
    quantity: "수량",
    resultError: "결과의 오류",
    yes: "있음",
    no: "없음",
    stored: "조회 뒤 캐시의 램프 재고",
    empty: "빈 캐시",
    http: "이 단계의 HTTP 요청",
    httpUnit: "건",
    httpUnitOne: "건",
    httpScope:
      "HTTP 수는 클라이언트 → 게이트웨이 구간입니다. 서브그래프 요청 수가 아닙니다.",
    errorData:
      "거절된 오류의 data에는 부분 응답이 남아 있습니다. 램프 availability는 null입니다.",
    raw: "이 조건의 전체 관측 보기",
    rawHelp:
      "실제 요청·응답 원문, Promise 결과, cache.extract()와 readQuery 관측입니다. 화면용 재실행 결과가 아닙니다.",
    decisionLabel: "다음 결과를 사용하는 쪽의 판단",
    decisionTitle: "오류 없음과 재확인은 다른 사실입니다.",
    decisionOne:
      "all은 성공한 필드를 사용할 수 있게 하지만, 실패에서 나온 null도 캐시에 남깁니다. none은 이번 부분 응답을 쓰지 않아 이전 수량 3을 남겼습니다. 어느 쪽이든 다음 캐시 조회에 오류가 없다는 사실만으로 재고를 새로 확인했다고 볼 수는 없습니다. 오류 맥락을 별도로 보관한다면, 언제 지우고 어떤 결과로 갱신할지도 정해야 합니다.",
    decisionTwo:
      "no-cache 조건은 빈 캐시에 첫 응답을 쓰지 않아 다음 조회에 HTTP 1건이 필요했습니다. 그 요청도 오류를 받았고, 이번 cache-first는 부분 데이터를 저장했습니다. 첫 조회의 no-cache가 이후 조회까지 캐시를 막지는 않습니다. 다시 요청하는 비용과, 무엇을 저장할지는 별개의 선택입니다.",
    limits:
      "Promise 기반 client.query와 메모리 캐시를 관측했습니다. React 렌더링, watchQuery·refetch, 재고의 유효 기한은 검사하지 않았습니다. null은 품절이 아닙니다. 수량 3은 이전 정상 응답의 값이며, 현재 재고와 같은지 다른지는 확인하지 않았습니다.",
    design: "정책 선택과 실험 범위 읽기 →",
    related: "앞선 실험: 서버 응답에는 무엇이 남았을까? →",
    provenance: "표시한 값의 출처",
    provenanceBody:
      "원본 파일의 고정 해시와 소스·조건을 확인한 뒤, 각 단계의 실제 결과와 캐시에서 값을 읽습니다. 전체 기록 검사기는 소스 저장소에 있습니다. 해시 일치는 실행 호스트의 진위를 인증하지 않습니다. 상품은 sku로 캐시에서 식별합니다.",
    rawFile: "원본 실행 기록 JSON",
    source: "실행 당시 소스",
    pendingSource: "최종 소스 연결 준비 중",
    provenanceRaw: "실행 환경과 원본 해시",
    checking: "기록 확인 중…",
    verified: "고정된 원본 해시 일치",
    provisional: "개발 중 기록 · 게시용 확정 전",
    unavailable: "실행 기록 확인 불가",
    loading: "원본이 확인된 뒤 비교 결과를 표시합니다.",
    loadError:
      "원본 파일을 읽거나 고정된 기록과 일치하는지 확인하지 못했습니다. 관측 결과를 표시하지 않습니다. 실험을 새로 실행한 실패로 해석하지 마세요.",
    home: "← 전체 엔지니어링 노트",
    footer: "독립적인 개인 실험 · Minjae Lee",
    explanations: {
      "all-cold":
        "부분 응답의 null은 캐시에 남았지만, 첫 GraphQL 오류는 다음 캐시 결과에 따라오지 않았습니다.",
      "none-warm":
        "실패한 network-only 호출은 Promise를 거절했습니다. 캐시에 남은 이전 수량 3은 다음 조회에서 HTTP 없이 반환됐습니다.",
      "all-warm":
        "이전 수량 3이 실패 응답의 null로 바뀌었습니다. 다음 조회는 서버에 다시 요청하지 않고 그 null을 반환했습니다.",
      "ignore-warm":
        "첫 조회부터 오류를 결과에 노출하지 않았습니다. 캐시에는 null이 저장됐으며, 오류 생략이 재고 조회 성공을 뜻하지는 않습니다.",
      "all-no-cache":
        "첫 응답을 저장하지 않아 다음 조회가 서버로 갔습니다. 같은 오류를 다시 받았고, 이번에는 부분 데이터를 캐시에 저장했습니다.",
    },
  },
  en: {
    reactFollowup: "React follow-up: what remains on screen after a failed recheck? →",
    skip: "Skip to the query comparison",
    back: "/ Engineering notes",
    language: "Language",
    eyebrow: "APOLLO CLIENT / CACHE AFTER AN ERROR",
    title: "Why does the next query\nhave no error?",
    lead: "An inventory query returned partial data and an error. The next cache-first query had no error and made zero HTTP requests. The first response's null was still there.",
    context:
      "Real local Apollo gateways and three HTTP subgraphs per gateway produce healthy and failed lamp lookups. Each case starts with a new client and cache, keeping those instances across successive queries. This page compares saved observations; it does not run a React UI.",
    recorded:
      "Synthetic products · Apollo Client 4.3.3 / GraphQL 16.14.2 · Recorded execution",
    compare: "The failed lookup, then the next query",
    controls: "Cache and error policy cases",
    policyHelp:
      "errorPolicy controls how errors and partial data are exposed. fetchPolicy controls reading from cache or server. cache-first needs no HTTP request when the query's fields are present. A stored null is a field value, not a cache miss.",
    cold: "Empty cache",
    warm: "Previously healthy cache",
    noCache: "Do not store the first result",
    startCold: "Start: empty cache",
    startWarm: "Start: cache warmed by real HTTP · lamp quantity 3",
    sameClient:
      "Successive client.query calls keep the same client and cache. The failure server remains selected.",
    failedStep: "01 · Query the failing inventory server",
    nextStep: "02 · Next cache-first query",
    promise: "Promise outcome",
    resolved: "Resolved",
    rejected: "Rejected",
    result: "Returned lamp inventory",
    noResult: "No resolved data",
    nullValue: "null · inventory unknown",
    quantity: "Quantity",
    resultError: "Error in the result",
    yes: "Present",
    no: "Absent",
    stored: "Lamp inventory in cache afterward",
    empty: "Empty cache",
    http: "HTTP requests in this step",
    httpUnit: "requests",
    httpUnitOne: "request",
    httpScope:
      "HTTP counts cover client → gateway calls, not subgraph requests.",
    errorData:
      "The rejected error's data still contains the partial response, with lamp availability null.",
    raw: "Inspect this case's complete observations",
    rawHelp:
      "Actual request/response bodies, promise outcomes, cache.extract() and readQuery observations—not a new execution for this view.",
    decisionLabel: "USING THE NEXT RESULT",
    decisionTitle: "No error is not a new confirmation.",
    decisionOne:
      "all keeps useful fields but also caches the null caused by the failure. none did not write that partial response, leaving the previous quantity, 3. In either case, an error-free cache read does not establish that inventory was checked again. Retaining error context separately also requires deciding when to clear it and which result replaces it.",
    decisionTwo:
      "Starting empty, no-cache did not store the first response, so the next query needed one HTTP request. It received the error again; this cache-first call then stored partial data. The first query's no-cache does not disable later caching. Paying for another request and choosing what to store are separate decisions.",
    limits:
      "These observations cover promise-based client.query and in-memory caching. React rendering, watchQuery/refetch and inventory expiry were not tested. Null does not mean sold out. Quantity 3 came from an earlier healthy response; its agreement with current inventory was not checked.",
    design: "Read the policy choices and scope →",
    related: "Earlier experiment: which server response values survive? →",
    provenance: "Where the displayed values come from",
    provenanceBody:
      "The reader checks the fixed file hash, source and cases before projecting each step's actual results and cache values. The full record checker lives in the source repository. Hash agreement does not authenticate the recording host. Products use sku as their cache identity.",
    rawFile: "Original execution recording JSON",
    source: "Source for this recording",
    pendingSource: "Final source link pending",
    provenanceRaw: "Runtime and raw recording hash",
    checking: "Checking the recording…",
    verified: "Pinned recording hash matches",
    provisional: "Development capture · not a publication pin",
    unavailable: "Recording unavailable",
    loading: "The comparison appears after the recording is verified.",
    loadError:
      "The recording could not be loaded or matched to its fixed identity. No observations are displayed. This is not a newly executed experiment failure.",
    home: "← All engineering notes",
    footer: "An independent experiment · Minjae Lee",
    explanations: {
      "all-cold":
        "The partial response's null stayed in the cache. Its original GraphQL error did not accompany the next cached result.",
      "none-warm":
        "The failed network-only call rejected its promise. The prior quantity 3 remained in cache and was returned next without HTTP.",
      "all-warm":
        "The failed response replaced quantity 3 with null. The next query returned that null without contacting the server again.",
      "ignore-warm":
        "The first query already omitted the error from its result. It cached null; hiding the error did not make the inventory lookup succeed.",
      "all-no-cache":
        "Not storing the first response sent the next query to the server. It received the same error again and this time cached partial data.",
    },
  },
};
