/**
 * Official Enamad trust-seal markup. Rendered via dangerouslySetInnerHTML so
 * the non-standard `code="..."` attribute on <img> (required by Enamad's
 * scanner) is preserved exactly as provided. Do NOT modify any attribute.
 */
export const ENAMAD_ID = "720710";
export const ENAMAD_CODE = "wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don";
export const ENAMAD_HREF = `https://trustseal.enamad.ir/?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`;
export const ENAMAD_IMG_SRC = `https://trustseal.enamad.ir/logo.aspx?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`;
export const ENAMAD_REFERRER_POLICY = "origin" as const;
export const ENAMAD_TARGET = "_blank" as const;

export const ENAMAD_HTML =
  `<a referrerpolicy='${ENAMAD_REFERRER_POLICY}' target='${ENAMAD_TARGET}' href='${ENAMAD_HREF}'><img referrerpolicy='${ENAMAD_REFERRER_POLICY}' src='${ENAMAD_IMG_SRC}' alt='' style='cursor:pointer' code='${ENAMAD_CODE}'/></a>`;

export function EnamadSeal({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: ENAMAD_HTML }}
    />
  );
}
