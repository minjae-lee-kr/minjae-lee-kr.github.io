export const copy = {
  ko: {
    skip: "기록 비교로 건너뛰기",
    back: "/ 엔지니어링 노트",
    language: "언어",
    eyebrow: "GIT / 승인의 사용을 기억하는 방법",
    title: "코드만 되돌리면,\n승인도 다시 쓸 수 있을까?",
    lead: "코드가 선택된 직후 실행기가 멈췄습니다. 승인 사용 기록이 없다고, 코드 선택도 없었던 걸까요?",
    context:
      "선택한 코드와 승인 사용 기록을 따로 쓰는 경로, 하나의 상태 commit에 묶는 경로를 실제 Git으로 비교했습니다. 먼저 어디에서 멈췄는지, 그다음 무엇을 되돌렸는지 살펴봅니다.",
    recorded:
      "독립적인 가상 실험 · 저장된 Git·프로세스 관측 · 이 페이지는 실행하지 않습니다",
    stopTitle: "중단 뒤에 남은 것은?",
    stopGroup: "기록된 중단 지점",
    separate: "코드 선택 후\n별도 기록 전",
    prepared: "상태 준비 후\n전환 전",
    selected: "상태 전환 후\n응답 전",
    stopHelp:
      "각 버튼은 별도의 예제 저장소에서 관측한 중단 지점입니다. A는 그 사례의 기준 코드, B는 검사한 후보입니다. OID는 객체의 고정된 식별자이고, ref는 어느 객체를 선택했는지 가리키는 포인터입니다.",
    stopExplain: {
      separate: "코드 ref에는 B가 남았지만 별도 승인 사용 기록은 없습니다.",
      prepared:
        "B와 사용 기록을 담은 상태 객체는 만들어졌습니다. 하지만 ref를 바꾸기 전에 종료했으므로 선택된 상태는 여전히 A와 빈 기록입니다.",
      selected:
        "호출자 응답은 없지만, 선택된 상태 OID에서 B와 사용 기록을 함께 읽었습니다. 같은 승인으로 다시 준비하면 이미 사용한 기록이 확인됩니다.",
    },
    selectedCode: "선택된 코드",
    baseline: "기준 코드",
    candidate: "검사한 후보",
    receipt: "승인 사용 기록",
    present: "있음",
    absent: "없음",
    separatePair: "서로 다른 저장 위치에서 읽은 값",
    sameState: "같은 상태 commit에서 읽은 두 값",
    stateOid: "상태 OID",
    codeOid: "코드 OID",
    ackAbsent: "호출자 응답 없음 · 작업자 종료 확인",
    rawLabel: "해당 관측과 원본 위치 보기",
    rollbackTitle: "같은 A로 되돌려도, 다음 시도는 달라집니다.",
    rollbackGroup: "되돌림 방식",
    rollbackLead:
      "같은 예제 저장소에서 두 되돌림을 차례로 실행했습니다. 각 화면은 해당 재시도 직전과 직후의 기록입니다.",
    preserve: "코드만 A로 되돌리기",
    rewind: "상태 ref 전체를 되감기",
    rollbackExplain: {
      preserve:
        "새 상태 commit에서 코드만 A로 바꾸고 사용 기록은 보존했습니다. 같은 승인은 이미 기록되어 있어 새 전환을 만들지 않았습니다.",
      rewind:
        "상태 ref를 초기 commit으로 강제로 되감아 사용 기록까지 지웠습니다. 아직 유효한 같은 승인으로 B를 다시 선택했습니다. 기록 보존 계약을 깨뜨린 대조군입니다.",
    },
    beforeRetry: "재시도 직전",
    afterRetry: "재시도 직후",
    preservedResult: "사용 기록이 남아 새 전환 없음",
    rewindResult: "기록을 지우자 같은 승인으로 다시 전환",
    readerTitle: "읽는 쪽도 하나의 OID를 끝까지 사용해야 합니다.",
    readerLead:
      "아래 관측은 위 되돌림보다 앞선, 첫 상태 전환 전후의 기록입니다. 처음 잡아 둔 OID와 새로 읽은 ref는 서로 다른 상태를 가리킵니다.",
    readerLabels: [
      "전환 전 · OID 캡처",
      "전환 후 · ref 새로 읽기",
      "그 뒤 · 처음 OID 다시 읽기",
    ],
    readerExplain:
      "첫 관측의 A와 두 번째 관측의 사용 기록을 조합하면 서로 다른 버전을 섞게 됩니다. 처음 OID를 다시 읽으면 원래의 A와 빈 기록이 함께 반환됩니다.",
    decisionLabel: "선택과 비용",
    decisionTitle: "기억을 남기려면, 소비자의 계약도 바뀝니다.",
    decisionBody:
      "이제 ref는 배포할 코드가 아니라 상태 문서를 가리킵니다. 소비자는 OID를 한 번 캡처하고 그 안에서 코드와 기록을 함께 읽어야 합니다. 기존 도구에 그대로 끼워 넣을 수 있는 변경이 아닙니다.",
    retentionCost:
      "쓰는 쪽도 기록을 보존해야 합니다. 이 실험은 기록을 최대 16개까지 다시 쓰며 정리 정책은 구현하지 않았습니다. 모든 쓰기는 한 ref에서 경쟁합니다. 코드 OID를 JSON에 적는 것만으로 Git GC에서 보존되지는 않아 별도 후보 ref를 유지합니다.",
    limits:
      "로컬의 가상 저장소에서, 완료된 Git 명령 사이에 실제 작업자를 종료했습니다. Git 갱신 도중의 전원 손실이나 배포·외부 효과를 검증한 것은 아닙니다. 자동으로 만든 승인은 사람의 신원 인증이 아니며, 기록을 지울 수 있는 작성자까지 막지는 않습니다.",
    provenance: "관측까지 이어지는 근거",
    provenanceBody:
      "별도 검사기는 상태·사용 기록·작업자 단계와 Git 조회 순서를 대조합니다. 이 페이지는 고정된 파일 해시를 확인한 뒤 해당 JSON에서 값을 읽습니다. 둘 다 실행 호스트의 진위를 인증하지는 않습니다.",
    fullNote: "설계 선택과 한계 읽기 →",
    expiryLabel: "후속 실험 / 승인 기한",
    expiryTitle: "확인할 때는 유효했다면, 충분할까요?",
    expiryBody:
      "승인 사용 기록을 보존해도, 유효기간 검사와 Git 반영은 다른 순간입니다. 마지막 검사는 통과했지만 반영 전에 만료되는 순서를 실제 Git 트랜잭션에서 만들었습니다. 반대로 검사 전에 만료시키면 변경을 거절했습니다.",
    expiryCost:
      "이 비교는 worker의 논리 시계만 제어합니다. 실제 5분을 기다리거나 시스템 시계를 바꾸지 않습니다. ‘유효할 때 시작’과 ‘기한 안에 완료’ 중 어떤 계약이 필요한지 먼저 정해야 합니다. 준비 단계의 Git hook은 관측 장치이며 운영용 해결책이 아닙니다.",
    expiryNote: "두 대조와 설계 판단 읽기 →",
    expiryRaw: "후속 실험의 별도 실행 기록 JSON",
    expiryDiagram: "두 대조의 순서 요약 · 길이는 경과 시간을 뜻하지 않습니다",
    beforeExpiry: "검사 전 만료",
    afterExpiry: "검사 후 만료",
    expired: "기한 경과",
    refused: "검사에서 거절",
    unchanged: "A 유지 · 기록 없음",
    checkedFresh: "유효기간 검사 통과",
    committedLate: "B 선택 · 기록 보존",
    rawFile: "원본 실행 기록 JSON",
    sourceLink: "이 기록의 소스",
    checkerLink: "기록 일관성 검사기",
    hashLabel: "실행 환경과 원본 해시",
    home: "← 모든 엔지니어링 노트",
    footer: "독립적인 개인 실험 · Minjae Lee",
    checking: "원본 기록 확인 중…",
    verified: "고정된 원본 해시 일치",
    failed: "기록을 확인할 수 없음",
    loadError:
      "파일을 읽거나 고정된 해시를 확인하지 못했습니다. 관측 결과를 표시하지 않습니다. 아래 원본과 설계 문서를 확인할 수 있습니다.",
    loading: "기록을 읽고 있습니다.",
  },
  en: {
    skip: "Skip to the recorded comparison",
    back: "/ Engineering notes",
    language: "Language",
    eyebrow: "GIT / REMEMBERING APPROVAL USE",
    title: "Roll back the code.\nReuse the approval?",
    lead: "The executor stopped just after selecting the code. If the approval receipt is missing, did the change never happen?",
    context:
      "Real Git traces compare writing the code selection and receipt separately with selecting one state commit containing both. First choose where execution stopped; then inspect what a rollback preserves.",
    recorded:
      "Independent synthetic experiment · Recorded Git and process observations · No execution on this page",
    stopTitle: "What remained after interruption?",
    stopGroup: "Recorded interruption point",
    separate: "Code selected,\nreceipt not written",
    prepared: "State prepared,\nnot selected",
    selected: "State selected,\nreply not sent",
    stopHelp:
      "Each button reads a separate fixture repository. A is that case's baseline code; B is its verified candidate. An OID identifies a fixed object; a ref is the pointer selecting an object.",
    stopExplain: {
      separate: "The code ref selects B, but the separate receipt is absent.",
      prepared:
        "A state object containing B and its receipt exists. The worker exited before moving the ref, so A and the empty receipt list remain selected.",
      selected:
        "The caller has no acknowledgement. Reading the selected state OID returns B and its receipt together; preparing the same approval again finds it already recorded.",
    },
    selectedCode: "Selected code",
    baseline: "Baseline code",
    candidate: "Verified candidate",
    receipt: "Approval receipt",
    present: "Present",
    absent: "Absent",
    separatePair: "Values read from separate storage locations",
    sameState: "Two fields read from one state commit",
    stateOid: "State OID",
    codeOid: "Code OID",
    ackAbsent: "No caller acknowledgement · Worker exit observed",
    rawLabel: "Inspect these observations and their raw locations",
    rollbackTitle: "Both return to A. The next attempt differs.",
    rollbackGroup: "Rollback choice",
    rollbackLead:
      "Both rollback paths ran in sequence in the same fixture repository. Each view shows the observations immediately before and after that retry.",
    preserve: "Restore A, keep receipts",
    rewind: "Rewind the whole state ref",
    rollbackExplain: {
      preserve:
        "A new state commit restores A while retaining the receipt. The same approval is already recorded, so no new transition is issued.",
      rewind:
        "Forcing the state ref back to its initial commit also removes the receipt. The same still-fresh approval selects B again. This control deliberately breaks the retention contract.",
    },
    beforeRetry: "Before retry",
    afterRetry: "After retry",
    preservedResult: "Receipt retained; no new transition",
    rewindResult: "Memory removed; the same approval selects B again",
    readerTitle: "The reader must follow one captured OID.",
    readerLead:
      "These observations surround the first state transition, before the rollback above. The captured OID and a fresh ref read point to different versions.",
    readerLabels: [
      "Before selection · capture OID",
      "After selection · reread ref",
      "Then · reread original OID",
    ],
    readerExplain:
      "Combining A from the first observation with the second observation's receipt mixes versions. Reading the captured OID again still returns the original A and empty receipt list together.",
    decisionLabel: "THE DECISION, AND ITS COST",
    decisionTitle: "Keeping memory changes the consumer's contract.",
    decisionBody:
      "The ref now points to a state document, not deployable code. Consumers must capture its OID once and resolve both code and receipts through it. This is not a drop-in change for existing tools.",
    retentionCost:
      "Writers must preserve receipts too. This fixture rewrites up to 16 retained receipts and implements no pruning policy. All writes contend on one ref. A code OID in JSON is not a Git GC edge; separate candidate refs retain those objects.",
    limits:
      "A real worker is stopped between completed Git commands in a synthetic local repository. This does not test power loss during a Git update, deployment or external effects. Scripted approval is not human authentication, and writers able to erase the record remain outside the protection.",
    provenance: "Follow the claim back to the observation.",
    provenanceBody:
      "A separate checker correlates states, receipts, worker phases and ordered Git reads. This page verifies a fixed file hash and reads its values from that JSON. Neither authenticates the recording host.",
    fullNote: "Read the design choices and limits →",
    expiryLabel: "FOLLOW-UP / APPROVAL DEADLINE",
    expiryTitle: "Fresh at the check. Is that enough?",
    expiryBody:
      "Preserving a receipt does not make the freshness check and Git ref update atomic. A real Git transaction was held after the last successful check, then allowed to commit after expiry. The control that expired before the recheck refused the change.",
    expiryCost:
      "Only the worker's logical clock is controlled: there is no five-minute wait or system-clock change. Permission to start while fresh and a deadline to finish are different contracts. The prepared Git hook is an observation tool, not a production remedy.",
    expiryNote: "Read both controls and the design decision →",
    expiryRaw: "Separate JSON recording for the follow-up",
    expiryDiagram:
      "Order of the two controls · widths do not represent elapsed time",
    beforeExpiry: "Expires before the check",
    afterExpiry: "Expires after the check",
    expired: "Deadline passes",
    refused: "Check refuses",
    unchanged: "A retained · no receipt",
    checkedFresh: "Freshness check passes",
    committedLate: "B selected · receipt kept",
    rawFile: "Original execution recording JSON",
    sourceLink: "Source for this recording",
    checkerLink: "Record consistency checker",
    hashLabel: "Runtime and raw recording hash",
    home: "← All engineering notes",
    footer: "An independent experiment · Minjae Lee",
    checking: "Checking the recording…",
    verified: "Pinned recording hash matches",
    failed: "Recording unavailable",
    loadError:
      "The recording could not be loaded or matched to its fixed hash. No observations are displayed. The raw file and design note remain available below.",
    loading: "Reading the recorded observations.",
  },
};
