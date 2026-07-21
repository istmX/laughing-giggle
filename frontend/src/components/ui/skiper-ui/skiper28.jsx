"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";

const Skiper28 = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const yMotionValue = useTransform(scrollYProgress, [0, 1], [487, 0]);
  const transform = useMotionTemplate`rotateX(30deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <ReactLenis root>
      <div
        ref={targetRef}
        className="relative z-0 h-[300vh] w-screen bg-[#F7F7F7] text-black selection:bg-black selection:text-white"
      >
        
        <div
          className="sticky top-0 mx-auto flex h-screen items-center justify-center bg-transparent py-20 overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            perspective: "200px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="w-full max-w-4xl px-6 text-center text-5xl font-bold leading-snug tracking-tighter md:text-6xl text-zinc-400"
          >
            <span className="text-black">Zenix</span> is the Architecture Engine ...{' '}
            we don&apos;t just write code ...{' '}
            we generate the entire foundation ...{' '}
            agents, UI tokens, complete project architecture ...{' '}
            in seconds ...{' '}
            you bring the idea ...{' '}
            we build the context ...{' '}
            <span className="text-black">just ship</span> ...
            <div className="absolute bottom-0 left-0 h-[60vh] w-full bg-gradient-to-b from-transparent to-[#F7F7F7]" />
          </motion.div>
        </div>
      </div>
    </ReactLenis>
  );
};

export { Skiper28 };
