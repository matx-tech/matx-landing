'use client';

/**
 * Fraction component — renders numerator over denominator with a horizontal bar.
 * Use inline for body text; standalone for answer blocks.
 */
export function Fraction({
  num,
  den,
  className = '',
}: {
  num: string | number;
  den: string | number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      aria-label={`${num}/${den}`}
      role='img'
    >
      <span className='tabular-nums leading-tight border-b border-current pb-px'>{num}</span>
      <span className='tabular-nums leading-tight pt-px'>{den}</span>
    </span>
  );
}

/**
 * Renders a simple inline math expression with fractions.
 * Supports operators + − × ÷ between fractions or integers.
 * Recognises patterns like "3/4", "1/2" and renders them as vertical fractions.
 * Operators are vertically centred on the fraction bar (vinculum), not
 * baseline-aligned with the numerator.
 */
export function InlineFractionalExpression({
  expression,
  className = '',
}: {
  expression: string;
  className?: string;
}) {
  // Tokenise: numbers (optionally with /), operators, and other text
  const tokens = expression.match(/(\d+\/\d+|\d+|[+−×÷=?\s]|\S+)/g) ?? [expression];
  const rendered = tokens.map((token, i) => {
    const fracMatch = token.match(/^(\d+)\/(\d+)$/);
    if (fracMatch) {
      // biome-ignore lint/suspicious/noArrayIndexKey: token position is the only stable identity (expression text can repeat tokens)
      return <Fraction key={i} num={fracMatch[1]} den={fracMatch[2]} />;
    }
    // Preserve whitespace as spaces
    if (/^\s+$/.test(token)) {
      // biome-ignore lint/suspicious/noArrayIndexKey: token position is the only stable identity (expression text can repeat tokens)
      return <span key={i}> </span>;
    }
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: token position is the only stable identity (expression text can repeat tokens)
      <span key={i} className='self-center'>
        {token}
      </span>
    );
  });

  return (
    <span className={`inline-flex items-center gap-px align-middle ${className}`}>{rendered}</span>
  );
}
