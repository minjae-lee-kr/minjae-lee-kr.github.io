export const caseCopy = {
  ko: {
    "late-success": {
      intro:
        "A의 이전 조회를 보류한 채 새 조회를 시작합니다. 새 조회의 실패를 먼저 보낸 뒤, 이전 조회의 성공을 내보냅니다.",
      takeaway:
        "두 구현 모두 최신 시도의 실패를 유지했습니다. 하지만 상태만 보호한 화면은 3개에서 7개로 바뀌었고, 쓰기를 보호한 화면은 3개를 유지했습니다. 실패 상태를 지키는 것과 값의 변경을 막는 것은 다른 조건이었습니다.",
    },
    "product-switch": {
      intro:
        "상품 A의 조회를 보류하고 상품 B로 이동합니다. B의 성공을 먼저 보낸 뒤 A의 응답을 내보냅니다.",
      takeaway:
        "두 화면 모두 B의 12개를 유지했습니다. 차이는 떠난 A의 캐시입니다. 자동 쓰기는 늦은 7개를 남겼고, 보호된 쓰기는 기존 3개를 유지했습니다. B를 지키는 데에는 둘 다 성공했지만, A 응답을 나중에 재사용할 기회는 달라졌습니다.",
    },
    "variable-switch": {
      intro:
        "상품은 A로 유지하고 창고 변수를 east에서 west로 바꿉니다. west의 응답 뒤에 보류한 east 응답을 내보냅니다.",
      takeaway:
        "두 화면 모두 west의 12개를 유지했습니다. east 캐시는 자동 쓰기에서 7개, 보호된 쓰기에서 3개가 됐습니다. 상품이 같아도 창고가 다르면 다른 값입니다. 캐시 키와 요청의 유효 범위가 모두 그 차이를 구분해야 합니다.",
    },
    aba: {
      intro:
        "A 조회를 보류한 채 B로 갔다가 다시 A로 돌아옵니다. 새 A 조회의 9개를 먼저 보낸 뒤, 예전 A 조회의 7개를 내보냅니다.",
      takeaway:
        "두 구현 모두 예전 A 요청의 상태 갱신을 거절했습니다. 그런데 자동 캐시 쓰기는 새 조회의 9개를 예전 응답의 7개로 바꿨습니다. 보호된 쓰기는 9개를 유지했습니다. 같은 A인지 검사하는 것뿐 아니라, 어느 조회가 값을 쓸 수 있는지도 결정해야 했습니다.",
    },
    "cache-read": {
      intro:
        "A의 정상 재고 3개를 받은 뒤 재확인을 실패시킵니다. 다음 단계에서는 네트워크 조회 없이 캐시만 다시 읽습니다.",
      takeaway:
        "두 구현 모두 3개와 최근 실패를 유지했습니다. HTTP 요청은 사례 전체에서 2개이며, 마지막 캐시 읽기는 요청을 추가하지 않았습니다. 기존 값을 다시 읽는 일이 네트워크 실패를 성공으로 바꾸지는 않았습니다.",
    },
  },
  en: {
    "late-success": {
      intro:
        "Hold an earlier lookup for A and start a new one. Release the newer failure first, then the earlier success.",
      takeaway:
        "Both implementations preserved the latest failure. Yet the status-only screen changed from 3 to 7, while guarded writes kept 3. Protecting failure status and preventing a value change were different conditions.",
    },
    "product-switch": {
      intro:
        "Hold a lookup for product A and move to product B. Release B’s success before releasing A’s response.",
      takeaway:
        "Both screens kept B at 12. The difference was A’s cache: automatic writes retained the late 7, while guarded writes kept the earlier 3. Both protected B, but they differed in whether A’s response could be reused later.",
    },
    "variable-switch": {
      intro:
        "Keep product A but change its warehouse variable from east to west. Release west’s response before the held east response.",
      takeaway:
        "Both screens kept west at 12. The east cache became 7 with automatic writes and remained 3 with guarded writes. The same product in a different warehouse is a different value; both cache identity and request ownership must preserve that distinction.",
    },
    aba: {
      intro:
        "Hold a lookup for A, move to B, then return to A. Release the new A result of 9 before the earlier A result of 7.",
      takeaway:
        "Both implementations rejected the old A request’s status update. But automatic cache writes replaced the new result of 9 with the earlier response’s 7. Guarded writes kept 9. Checking that the target is A was not enough; the code also had to decide which lookup could write.",
    },
    "cache-read": {
      intro:
        "Receive a healthy count of 3 for A, then fail a recheck. In the next step, read only the cache without a network lookup.",
      takeaway:
        "Both implementations kept 3 and the latest failure. Each case made two HTTP requests in total; the final cache read added none. Reading an existing value did not turn a failed network attempt into a success.",
    },
  },
};
