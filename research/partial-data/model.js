import { PIN } from "./pin.js";

export const caseIds = [
  "nullable-per-key",
  "nullable-whole-batch",
  "non-null-per-key",
];

export async function readRecording(bytes) {
  const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
  if (hash !== PIN.sha256) throw new Error("Published recording hash mismatch");
  const report = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(bytes),
  );
  if (
    report.kind !== "batch-failure-boundary" ||
    report.version !== 1 ||
    !report.sourceUnchanged ||
    report.sourceBefore.git.head !== PIN.revision ||
    report.sourceAfter.git.head !== PIN.revision ||
    report.sourceBefore.git.dirty ||
    report.sourceAfter.git.dirty ||
    report.cases.map((item) => item.id).join("|") !== caseIds.join("|")
  )
    throw new Error("Published capture identity mismatch");
  return {
    hash,
    revision: PIN.revision,
    project(id) {
      const index = caseIds.indexOf(id);
      if (index < 0) throw new Error("Unknown recorded case");
      const item = structuredClone(report.cases[index]);
      const products = item.response.body.data.products;
      return {
        id,
        fixture: item.fixture,
        response: item.response,
        products,
        paths: item.response.body.errors.map((error) => error.path),
        productCount: products.filter((product) => product !== null).length,
        inventoryCount: products.filter(
          (product) => product?.availability != null,
        ).length,
        pointer: `/cases/${index}/response/body`,
      };
    },
  };
}

export function readState(search = "") {
  const params = new URLSearchParams(search);
  return {
    id: caseIds.includes(params.get("case")) ? params.get("case") : caseIds[0],
    lang: params.get("lang") === "ko" ? "ko" : "en",
  };
}

export function formatPath(path) {
  return path
    .map((part, index) =>
      typeof part === "number" ? `[${part}]` : `${index ? "." : ""}${part}`,
    )
    .join("");
}
