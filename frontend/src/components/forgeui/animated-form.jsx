"use client";;
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const AnimatedForm = ({
  delay = 7000,
  name = "username"
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  const delayTime = Math.max(delay, 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, delayTime);

    return () => clearInterval(interval);
  }, [delayTime]);

  return <Animatedform key={animationKey} name={name} />;
};

export default AnimatedForm;

const Animatedform = ({
  name
}) => {
  const email = "alex@zenix.app";
  const password = "********";
  const circleLength = 2 * Math.PI * 50;
  const safeName = name || "Alex Morgan";
  const safeNameLength = Math.max(safeName.length, 1);

  const nameAnimationDuration = Math.ceil(safeNameLength / 5);
  const passwordAnimationDuration = 2;
  const nameStaggerDelay = nameAnimationDuration / safeNameLength;
  const passwordStaggerDelay = passwordAnimationDuration / password.length;

  return (
    <div className={cn("relative w-full max-w-[22rem] sm:max-w-[26rem]") }>
      <div
        className="w-full rounded-2xl border border-border bg-card p-1.5 shadow-sm">
        <div
          className={cn(
            "relative",
            "flex flex-col gap-1 divide-y divide-border rounded-xl border border-border bg-background"
          )}>
          <div
            className={cn(
              "px-3 pt-3 pb-2 text-sm font-medium tracking-[0.16em] text-muted-foreground"
            )}>
            GOOGLE OR EMAIL
          </div>
          <div className="flex flex-col gap-2 p-2">
            <div
              className={cn(
                "w-full rounded-xl border border-border p-3",
                "flex items-center justify-between gap-4",
                "bg-card"
              )}>
              <div className="text-sm text-foreground">
                {safeName.split("").map((char, index) => (
                  <motion.span
                    key={`name-${index}`}
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      delay: index * nameStaggerDelay,
                      ease: "easeOut",
                    }}>
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              <AnimatedCheckmarkCircle
                circleLength={circleLength}
                strokeDuration={nameAnimationDuration * 3 + 1}
                strokeDelay={0}
                fillDelay={nameAnimationDuration + 0.1}
                checkmarkDelay={nameAnimationDuration + 0.2} />
            </div>

            <div
              className={cn(
                "rounded-xl border border-border p-3",
                "flex items-center justify-between gap-8",
                "bg-card"
              )}>
              <div className="font-mono text-sm text-muted-foreground">
                {email.split("").map((char, index) => (
                  <motion.span
                    key={`password-${index}`}
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      delay:
                        nameAnimationDuration +
                        0.5 +
                        index * passwordStaggerDelay,
                      ease: "easeOut",
                    }}>
                    {char}
                  </motion.span>
                ))}
              </div>

              <AnimatedCheckmarkCircle
                circleLength={circleLength}
                strokeDuration={7}
                strokeDelay={nameAnimationDuration + 0.5}
                fillDelay={
                  nameAnimationDuration + passwordAnimationDuration + 0.6
                }
                checkmarkDelay={
                  nameAnimationDuration + passwordAnimationDuration + 0.7
                } />
            </div>
            <div
              className={cn(
                "h-[37.6px] rounded-xl border border-border opacity-60",
                "bg-muted"
              )} />
          </div>
        </div>
      </div>
      <ContainerMask />
      <div className="absolute bottom-0 left-0 flex h-14 w-full items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm">
          <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            G
          </span>
          Google
        </div>
      </div>
    </div>
  );
};

export const AnimatedCheckmarkCircle = ({
  circleLength,
  strokeDuration,
  strokeDelay,
  fillDelay,
  checkmarkDelay
}) => {
  return (
    <div className="relative">
      <svg width="20" height="20" className="-rotate-90">
        <motion.circle
          cx="10"
          cy="10"
          r="7"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circleLength}
          strokeDashoffset={circleLength}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: strokeDuration,
            ease: "easeInOut",
            delay: strokeDelay,
          }} />
        <motion.circle
          cx="10"
          cy="10"
          r="7"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            delay: fillDelay,
          }} />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-primary-foreground"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          delay: checkmarkDelay,
        }}>
        <Check className="size-2.5" />
      </motion.div>
    </div>
  );
};

const ContainerMask = () => {
  return (
    <>
      <div
        className="absolute bottom-0 left-0 h-10 w-full bg-[linear-gradient(to_top,var(--background)_60%,transparent_100%)]" />
      <div
        className="absolute bottom-0 left-0 h-24 w-3 bg-[linear-gradient(to_top,var(--background)_60%,transparent_100%)]" />
      <div
        className="absolute right-0 bottom-0 h-24 w-3 bg-[linear-gradient(to_top,var(--background)_60%,transparent_100%)]" />
    </>
  );
};
