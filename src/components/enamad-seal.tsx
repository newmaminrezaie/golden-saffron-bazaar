/**
 * Official Enamad trust-seal markup. Rendered via dangerouslySetInnerHTML so
 * the non-standard `code="..."` attribute on <img> (required by Enamad's
 * scanner) is preserved exactly as provided. Do NOT modify any attribute.
 */
const ENAMAD_HTML =
  "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=720710&Code=wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=720710&Code=wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don' alt='' style='cursor:pointer' code='wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don'/></a>";

export function EnamadSeal({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: ENAMAD_HTML }}
    />
  );
}
