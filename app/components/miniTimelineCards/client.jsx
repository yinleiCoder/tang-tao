"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function MiniTimelineCards() {
  const lenisRef = useRef();
  const spotlightContainerRef = useRef();
  const spotlightImagesRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(
    () => {
      const spotlightImgFinalPositions = [
        [-120, -120],
        [40, -130],
        [-140, 10],
        [20, 20],
      ];

      const spotlightContainer = spotlightContainerRef.current;
      const spotlightImagesDivs = spotlightImagesRef.current;
      const spotlightImages =
        spotlightImagesDivs.querySelectorAll(".spotlightImg");
      const photoInfos =
        spotlightImagesDivs.querySelectorAll(".spotlightImg span");
      ScrollTrigger.create({
        trigger: spotlightContainerRef.current,
        start: "top top",
        end: `+${window.innerHeight * 6}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const initialRotations = [5, -3, 3.5, -1];
          const phaseOneStartOffsets = [0, 0.1, 0.2, 0.3];

          spotlightImages.forEach((img, index) => {
            const initialRotation = initialRotations[index];
            const phase1Start = phaseOneStartOffsets[index];
            const phase1End = Math.min(
              0.45,
              phase1Start + (0.45 - phase1Start) * 0.9
            );
            let x = -50;
            let y, rotation;

            if (progress < phase1Start) {
              y = 200;
              rotation = initialRotation;
            } else if (progress <= 0.45) {
              let phase1Progress;

              if (progress >= phase1End) {
                phase1Progress = 1;
              } else {
                const linearProgress =
                  (progress - phase1Start) / (phase1End - phase1Start);
                phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
              }
              y = 200 - phase1Progress * 250;
              rotation = initialRotation;
            } else {
              y = -50;
              rotation = initialRotation;
            }
            photoInfos.forEach((photo, index) => {
              gsap.to(photo, {
                opacity: 0,
              });
            });

            const phaseTwoStartOffsets = [0.5, 0.55, 0.6, 0.65];
            const phase2Start = phaseTwoStartOffsets[index];
            const phase2End = Math.min(
              0.95,
              phase2Start + (0.95 - phase2Start) * 0.9
            );
            const finalX = spotlightImgFinalPositions[index][0];
            const finalY = spotlightImgFinalPositions[index][1];

            if (progress >= phase2Start && progress <= 0.95) {
              let phase2Process;
              if (progress >= phase2End) {
                phase2Process = 1;
              } else {
                const linearProgress =
                  (progress - phase2Start) / (phase2End - phase2Start);
                phase2Process = 1 - Math.pow(1 - linearProgress, 3);
              }
              x = -50 + (finalX + 50) * phase2Process;
              y = -50 + (finalY + 50) * phase2Process;
              photoInfos.forEach((photo, index) => {
                gsap.to(photo, {
                  opacity: 0,
                });
              });
            } else if (progress > 0.95) {
              x = finalX;
              y = finalY;
              rotation = 0;

              photoInfos.forEach((photo, index) => {
                gsap.to(photo, {
                  opacity: 1,
                });
              });
            }

            gsap.set(img, {
              transform: `translate(${x}%,${y}%) rotate(${rotation}deg)`,
            });
          });
        },
      });
    },
    { scope: spotlightContainerRef, dependencies: [window] }
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <section
        ref={spotlightContainerRef}
        className="spotlightContainer relative p-4 flex flex-col items-center justify-center overflow-hidden w-full h-svh bg-[#fffef8]"
      >
        <div className="spotlightHeader">
          <h1 className="font-medium text-6xl tracking-widest">
            爱若初见
          </h1>
        </div>
        <div
          ref={spotlightImagesRef}
          className="spotlightImages absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          <div className="spotlightImg absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[200%] will-change-transform w-[clamp(20rem,25vw,40rem)] aspect-7/5">
            <Image
              src="/images/tt92.jpg"
              alt="三台县杜甫草堂"
              fill
              className="absolute w-full h-full object-cover rounded-md"
            />
            <span className="inline-block opacity-0 absolute left-1/2 -translate-x-1/2 -bottom-5 text-center z-20 text-xs">
              (摄于三台县杜甫草堂)
            </span>
          </div>
          <div className="spotlightImg absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[200%] will-change-transform w-[clamp(20rem,25vw,40rem)] aspect-7/5">
            <Image
              src="/images/tt31.jpg"
              alt="遂宁市万达广场附近"
              fill
              className="absolute w-full h-full object-cover rounded-md"
            />
            <span className="inline-block opacity-0 absolute left-1/2 -translate-x-1/2 -bottom-5 text-center z-20 text-xs">
              (摄于遂宁市万达广场附近)
            </span>
          </div>
          <div className="spotlightImg absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[200%] will-change-transform w-[clamp(20rem,25vw,40rem)] aspect-7/5">
            <Image
              src="/images/tt32.jpg"
              alt="酷酷的涛妹"
              fill
              className="absolute w-full h-full object-cover rounded-md"
            />
            <span className="inline-block opacity-0 absolute left-1/2 -translate-x-1/2 -bottom-5 text-center z-20 text-xs">
              (摄于遂宁市联福家园)
            </span>
          </div>
          <div className="spotlightImg absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[200%] will-change-transform w-[clamp(20rem,25vw,40rem)] aspect-7/5">
            <Image
              src="/images/tt37.jpg"
              alt="和涛妹合照"
              fill
              className="absolute w-full h-full object-cover rounded-md"
            />
            <span className="inline-block opacity-0 absolute left-1/2 -translate-x-1/2 -bottom-5 text-center z-20 text-xs">
              (摄于遂宁市万达广场)
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
