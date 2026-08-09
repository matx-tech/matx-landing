'use client';

/**
 * Renders a numerator above a denominator with a horizontal bar.
 *
 * @param num - The fraction's numerator
 * @param den - The fraction's denominator
 * @param className - An optional CSS class applied to the fraction
 * @returns An accessible fraction element labeled as `num/den`
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
 * Renders an inline mathematical expression with numeric fractions.
 *
 * @param expression - The expression to render, including fractions, numbers, operators, and whitespace
 * @param className - An optional CSS class for the container
 * @returns An inline container displaying the formatted expression
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
