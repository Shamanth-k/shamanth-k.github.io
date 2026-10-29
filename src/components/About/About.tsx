import ScrollColorParagraph from "@/components/About/ScrollColorParagraph";

const ABOUT_OPENING_EMPHASIS =
  "I'm a full-stack developer and DevOps enthusiast";
const ABOUT_CONTINUATION = [
  { text: "who enjoys " },
  { text: "building things", italic: true },
  {
    text: ", solving problems, and turning ideas into reliable applications. Beyond code, I love ",
  },
  { text: "exploring new places", italic: true },
  { text: ", photography, and experimenting with creative ideas." },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-visible bg-transparent"
    >
      <div
        data-about-scroll-track
        className="about-scroll-track relative mx-auto w-full max-w-[1400px] px-[clamp(20px,5vw,72px)]"
      >
        <div
          data-about-sticky
          className="about-scroll-sticky relative mx-auto w-full py-[8vh] max-[767px]:py-8"
        >
          <div className="relative mb-4 h-[40px] w-full">
            <span
              data-scroll-reveal
              className="about-support-reveal absolute left-1 top-0 -rotate-[7.89deg] font-[family-name:var(--font-just-another-hand)] text-[29px] leading-[29px] tracking-[0.8px] text-black"
            >
              about me!
            </span>
            <img
              src="/arrows/heading-underline.svg"
              alt=""
              data-scroll-reveal
              style={{ transitionDelay: "140ms" }}
              className="about-support-reveal pointer-events-none absolute left-[26px] top-[23px] h-[15px] w-[78px]"
            />
          </div>
          <ScrollColorParagraph
            openingEmphasis={ABOUT_OPENING_EMPHASIS}
            continuation={ABOUT_CONTINUATION}
            className="m-0 text-left font-[family-name:var(--font-inter)] text-[clamp(23px,3.4vw,44px)] font-bold leading-[1.2] tracking-[-0.035em]"
          />

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open resume PDF in a new tab"
            data-scroll-reveal
            style={{ transitionDelay: "420ms" }}
            className="
              group
              about-support-reveal
              relative
              mt-7
              inline-flex
              min-h-[58px]
              items-center
              gap-5
              rounded-full
              border
              border-black/80
              bg-[#F8DB6A]
              py-2
              pl-6
              pr-2
              shadow-[4px_5px_0_#111]
              transition-[transform,box-shadow]
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[5px_7px_0_#111]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-black
            "
          >
            <span className="flex flex-col items-start leading-none">
              <span className="font-[family-name:var(--font-inter)] text-[16px] font-bold tracking-[-0.3px] text-black">
                Resume
              </span>
              <span className="mt-1.5 font-[family-name:var(--font-inter)] text-[9px] font-semibold uppercase tracking-[0.14em] text-black/65">
                PDF
              </span>
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-black text-[#F8DB6A] transition-transform duration-200 group-hover:rotate-45">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
              >
                <path
                  d="M9 2h5v5M14 2 7 9M12 9v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
