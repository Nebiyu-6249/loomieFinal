import { Reveal } from "./Reveal";

/**
 * The opener every route shares. One h1, an eyebrow above it, and an optional
 * lede — set at the narrowest measure on the page, because the widening runs
 * downward from here.
 */
interface PageIntroProps {
  eyebrow: string;
  title: string;
  lede?: string;
}

export function PageIntro({ eyebrow, title, lede }: PageIntroProps) {
  return (
    <section className="px-step-2 pb-step-4 pt-step-4 md:px-step-3 md:pt-step-5">
      <div className="mx-auto max-w-[100rem]">
        <Reveal rule={false}>
          <p className="type-micro text-slate">{eyebrow}</p>
          <h1 className="type-display mt-step-2 max-w-[15ch] text-[clamp(2.5rem,8vw,7rem)]">
            {title}
          </h1>
          {lede ? (
            <p className="type-lead measure mt-step-3 text-slate">{lede}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
