import { type SVGProps, useId } from "react";

/** The Dream app icon: a night sky with a star over rolling clouds. */
export default function DreamLogo(props: SVGProps<SVGSVGElement>) {
  const clip = useId();

  return (
    <svg viewBox="0 0 1024 1024" aria-hidden="true" {...props}>
      <defs>
        <clipPath id={clip}>
          <circle cx="512" cy="512" r="388" />
        </clipPath>
      </defs>
      <circle cx="512" cy="512" r="512" fill="#fff" />
      <circle cx="512" cy="512" r="396" fill="#000" />
      <path
        clipPath={`url(#${clip})`}
        fill="#fff"
        d="M110 572C170 534 240 514 330 518C420 524 500 590 568 690C625 668 700 664 760 682C792 694 818 712 846 738L900 1000H100Z"
      />
      <path
        fill="#fff"
        d="M625 280C632 342 650 380 735 393C650 406 632 446 625 506C618 446 600 406 515 393C600 380 618 342 625 280Z"
      />
    </svg>
  );
}
