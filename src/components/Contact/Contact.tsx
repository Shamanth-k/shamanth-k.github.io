"use client";

import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      id="contact"
      className="
        relative
        mt-[120px]
        min-h-[900px]
        w-full
        px-[24px]
        pb-[100px]
      "
    >
      {/* =========================================================
          CONTACT TITLE / FRAME
      ========================================================= */}

      <div
        data-scroll-reveal
        className="relative mx-auto h-[390px] w-full max-w-[614px]"
      >
        {/* =======================================================
            EXACT CONTACT SVG BOX
        ======================================================= */}

        <svg
          width="614"
          height="284"
          viewBox="0 0 614 284"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-auto
            w-full
            max-w-[614px]
            -translate-x-1/2
            overflow-visible
          "
          aria-hidden="true"
        >
          <rect
            x="6.21707"
            y="47.1578"
            width="586.909"
            height="230.542"
            transform="rotate(-4 6.21707 47.1578)"
            stroke="black"
            strokeWidth="3"
          />

          <rect
            y="41.7534"
            width="11.2446"
            height="11.2446"
            transform="rotate(-4 0 41.7534)"
            fill="#005277"
          />

          <rect
            x="16.1101"
            y="272.137"
            width="11.2446"
            height="11.2446"
            transform="rotate(-4 16.1101 272.137)"
            fill="#005277"
          />

          <rect
            x="601.993"
            y="231.168"
            width="11.2446"
            height="11.2446"
            transform="rotate(-4 601.993 231.168)"
            fill="#005277"
          />

          <rect
            x="585.883"
            y="0.78418"
            width="11.2446"
            height="11.2446"
            transform="rotate(-4 585.883 0.78418)"
            fill="#005277"
          />
        </svg>

        {/* =======================================================
            CONTACT WORD
        ======================================================= */}

        <div
          className="
            absolute
            left-1/2
            top-[28px]
            -translate-x-1/2
            rotate-[-4deg]
            whitespace-nowrap
          "
        >
          <span
            className="
              contact-heading

              font-[family-name:var(--font-jersey-15)]
              tracking-[0.8px]
              text-[#111111]
            "
          >
            CONTACT
          </span>
        </div>

        {/* =======================================================
            AVAILABLE FOR COOL PROJECTS
        ======================================================= */}

        <div
          className="
            absolute
            left-1/2
            top-[207px]
            z-20
            flex
            -translate-x-1/2
            rotate-[-3deg]
            items-center
            gap-[8px]
            whitespace-nowrap
          "
        >
          <span
            className="
              h-[9px]
              w-[9px]
              shrink-0
              rounded-full
              bg-[#005277]
            "
          />

          <span
            className="
              font-[family-name:var(--font-just-another-hand)]
              text-[29px]
              leading-[30px]
              tracking-[0.8px]
              text-[#111111]
            "
          >
            available for cool projects
          </span>
        </div>
      </div>

      {/* =========================================================
          CONTACT CONTENT
      ========================================================= */}

      <div
        data-scroll-reveal
        className="
          relative
          mx-auto
          mt-[-25px]
          flex
          w-full
          max-w-[878px]
          items-start
          justify-center
          gap-[55px]
          max-[800px]:flex-col
          max-[800px]:items-center
        "
      >
        {/* =======================================================
            YELLOW LET'S TALK BOX
        ======================================================= */}

        <div
          className="
            relative
            h-[372px]
            w-[439px]
            shrink-0
            rotate-[-1deg]
            bg-[#F8DB6A]
            max-[500px]:h-[320px]
            max-[500px]:w-full
          "
        >
          {/* Main handwritten message */}

          <p
            className="
              absolute
              left-[33px]
              top-[30px]
              m-0
              max-w-[347px]
              font-[family-name:var(--font-just-another-hand)]
              text-[38px]
              leading-[1.08]
              tracking-[0.8px]
              text-[#111111]
              max-[500px]:text-[32px]
            "
          >
            Got an idea?
            <br />
            Let&apos;s build
            <br />
            something cool.
          </p>

          {/* Black button */}

          <a
            href="mailto:shamanthk140@gmail.com"
            className="
              absolute
              bottom-[46px]
              left-[33px]
              flex
              h-[71px]
              w-[204px]
              items-center
              justify-center
              bg-[#111111]
              font-[family-name:var(--font-jersey-15)]
              text-[40px]
              leading-none
              tracking-[0.8px]
              text-[#FAF8F3]
              transition-transform
              duration-200
              hover:scale-[1.03]
            "
          >
            LET&apos;S TALK
          </a>
        </div>

        {/* =======================================================
            RIGHT SIDE
            MAIL + GITHUB + LINKEDIN
        ======================================================= */}

        <div
          className="
            flex
            min-h-[372px]
            flex-1
            flex-col
            justify-between
            py-[28px]
            max-[800px]:min-h-0
            max-[800px]:w-full
            max-[800px]:items-center
          "
        >
          {/* =====================================================
              SMALL INTRO
          ===================================================== */}

          <div className="max-w-[300px]">
            <p
              className="
                m-0
                font-[family-name:var(--font-poppins)]
                text-[12px]
                font-medium
                uppercase
                tracking-[1.2px]
                text-[#111111]/45
              "
            >
              Have something in mind?
            </p>

            <p
              className="
                mt-[10px]
                m-0
                font-[family-name:var(--font-poppins)]
                text-[18px]
                font-semibold
                leading-[28px]
                tracking-[0.2px]
                text-[#111111]
              "
            >
              Let&apos;s turn the idea into
              <br />
              something real.
            </p>
          </div>

          {/* =====================================================
              CONTACT LINKS
          ===================================================== */}

          <div
            className="
              flex
              w-full
              max-w-[300px]
              flex-col
              gap-[10px]
            "
          >
            <span
              className="
                font-[family-name:var(--font-poppins)]
                text-[9px]
                font-medium
                uppercase
                tracking-[1.2px]
                text-[#111111]/45
              "
            >
              Reach me
            </span>

            {/* ===================================================
                MAIL
            =================================================== */}

            <a
              href="mailto:shamanthk140@gmail.com"
              className="
                group
                flex
                h-[50px]
                w-full
                items-center
                gap-[12px]
                rounded-[5px]
                border
                border-[#111111]
                bg-white
                px-[14px]
                transition-all
                duration-200
                hover:-translate-y-[2px]
                hover:bg-[#F8DB6A]
              "
            >
              <span
                className="
                  flex
                  h-[25px]
                  w-[25px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F8DB6A]
                  transition-colors
                  group-hover:bg-white
                "
              >
                <Mail size={13} strokeWidth={2} className="text-[#111111]" />
              </span>

              <span
                className="
                  font-[family-name:var(--font-inter)]
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.8px]
                  text-[#111111]
                "
              >
                MAIL
              </span>

              <span
                className="
                  ml-auto
                  font-[family-name:var(--font-poppins)]
                  text-[9px]
                  text-[#111111]/45
                "
              >
                say hello →
              </span>
            </a>

            {/* ===================================================
                GITHUB
            =================================================== */}

            <a
              href="https://github.com/Shamanth-k"
              target="_blank"
              rel="noreferrer"
              className="
                group
                flex
                h-[50px]
                w-full
                items-center
                gap-[12px]
                rounded-[5px]
                border
                border-[#111111]
                bg-white
                px-[14px]
                transition-all
                duration-200
                hover:-translate-y-[2px]
                hover:bg-[#F8DB6A]
              "
            >
              <span
                className="
                  flex
                  h-[25px]
                  w-[25px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F8DB6A]
                  transition-colors
                  group-hover:bg-white
                "
              >
                <FaGithub size={14} className="text-[#111111]" />
              </span>

              <span
                className="
                  font-[family-name:var(--font-inter)]
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.8px]
                  text-[#111111]
                "
              >
                GITHUB
              </span>

              <span
                className="
                  ml-auto
                  font-[family-name:var(--font-poppins)]
                  text-[9px]
                  text-[#111111]/45
                "
              >
                view code →
              </span>
            </a>

            {/* ===================================================
                LINKEDIN
            =================================================== */}

            <a
              href="https://www.linkedin.com/in/shamanth-krishna-v-r-89178b267/"
              target="_blank"
              rel="noreferrer"
              className="
                group
                flex
                h-[50px]
                w-full
                items-center
                gap-[12px]
                rounded-[5px]
                border
                border-[#111111]
                bg-white
                px-[14px]
                transition-all
                duration-200
                hover:-translate-y-[2px]
                hover:bg-[#F8DB6A]
              "
            >
              <span
                className="
                  flex
                  h-[25px]
                  w-[25px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F8DB6A]
                  transition-colors
                  group-hover:bg-white
                "
              >
                <FaLinkedinIn size={13} className="text-[#111111]" />
              </span>

              <span
                className="
                  font-[family-name:var(--font-inter)]
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.8px]
                  text-[#111111]
                "
              >
                LINKEDIN
              </span>

              <span
                className="
                  ml-auto
                  font-[family-name:var(--font-poppins)]
                  text-[9px]
                  text-[#111111]/45
                "
              >
                connect →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          FULL-WIDTH BOTTOM FOOTER LINE
      ========================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          border-t
          border-[#111111]/15
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1220px]
            items-center
            justify-between
            px-[24px]
            py-[18px]
            max-[600px]:flex-col
            max-[600px]:gap-[8px]
          "
        >
          <span
            className="
              font-[family-name:var(--font-inter)]
              text-[8px]
              font-medium
              uppercase
              tracking-[1px]
              text-[#111111]/45
            "
          >
            LET&apos;S MAKE SOMETHING GOOD
          </span>

          <span
            className="
              font-[family-name:var(--font-inter)]
              text-[8px]
              font-medium
              uppercase
              tracking-[1px]
              text-[#111111]/45
            "
          >
            © 2026
          </span>
        </div>
      </div>
    </section>
  );
}
