"use client";

import "./index.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ReactLenis, useLenis } from "lenis/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function InfiniteMarquee() {
  const lenisRef = useRef();
  const marqueeContainerRef = useRef();
  const indicatorRef = useRef();
  const marqueeTrackRef = useRef();
  const targetVelocityRef = useRef(0);

  const lenis = useLenis((lenis) => {
    // called every scroll
    targetVelocityRef.current = Math.abs(lenis.velocity) * 0.02;
  });

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
      const textBlocks = gsap.utils.toArray(".meBlock p");
      const splitInstances = textBlocks.map((block) =>
        SplitText.create(block, { type: "chars", mask: "chars" })
      );
      gsap.set(splitInstances[1].chars, { yPercent: 100 });
      gsap.set(splitInstances[2].chars, { yPercent: 100 });

      const overlapCount = 3;
      const getWordProgress = (phaseProgress, wordIndex, totalWords) => {
        const totalLength = 1 + overlapCount / totalWords;
        const scale =
          1 /
          Math.min(
            totalLength,
            1 + (totalWords - 1) / totalWords + overlapCount / totalWords
          );
        const startTime = (wordIndex / totalWords) * scale;
        const endTime = startTime + (overlapCount / totalWords) * scale;
        const duration = endTime - startTime;
        if (phaseProgress <= startTime) return 0;
        if (phaseProgress >= endTime) return 1;
        return (phaseProgress - startTime) / duration;
      };

      const animateBlock = (outBlock, inBlock, phaseProgress) => {
        outBlock.chars.forEach((char, index) => {
          const progress = getWordProgress(
            phaseProgress,
            index,
            outBlock.chars.length
          );
          gsap.set(char, {
            yPercent: progress * 100,
          });
        });

        inBlock.chars.forEach((char, index) => {
          const progress = getWordProgress(
            phaseProgress,
            index,
            inBlock.chars.length
          );
          gsap.set(char, {
            yPercent: 100 - progress * 100,
          });
        });
      };

      const indicator = indicatorRef.current;

      const marqueeTrack = marqueeTrackRef.current;
      const items = gsap.utils.toArray(".marqueeItem");
      items.forEach((item) => marqueeTrack.appendChild(item.cloneNode(true)));

      let marqueePosition = 0;
      let smoothVelocity = 0;

      gsap.ticker.add(() => {
        smoothVelocity += (targetVelocityRef.current - smoothVelocity) * 0.5;
        const baseSpeed = 0.45;
        const speed = baseSpeed + smoothVelocity * 9;
        marqueePosition -= speed;

        const trackWidth = marqueeTrack.scrollWidth / 2;
        if (marqueePosition <= -trackWidth) {
          marqueePosition = 0;
        }

        gsap.set(marqueeTrack, {
          x: marqueePosition,
        });

        targetVelocityRef.current *= 0.9;
      });

      ScrollTrigger.create({
        trigger: document.querySelector(".marqueeContainer"),
        start: `top top`,
        end: `+${window.innerHeight * 6}px`,
        // markers: true,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const scrollProgress = self.progress;
          gsap.set(indicator, {
            "--progress": scrollProgress,
          });

          if (scrollProgress <= 0.5) {
            const phase1 = scrollProgress / 0.5;
            animateBlock(splitInstances[0], splitInstances[1], phase1);
          } else {
            const phase2 = (scrollProgress - 0.5) / 0.5;
            gsap.set(splitInstances[0].chars, {
              yPercent: 100,
            });
            animateBlock(splitInstances[1], splitInstances[2], phase2);
          }
        },
      });
    },
    { scope: marqueeContainerRef, dependencies: [] }
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <div
        ref={marqueeContainerRef}
        className="marqueeContainer relative w-full h-screen bg-[#fffef8]"
      >
        <section className="hero absolute top-0 left-0 w-full h-svh overflow-hidden">
          <div className="aboutMe w-full absolute left-0 top-1/2 -translate-y-1/2 p-4 flex flex-col lg:flex-row gap-4">
            <div className="meBlock flex-1">
              <p className="font-medium text-3xl lg:text-2xl leading-normal">
                曾经，在中国联通(网络部)工作
              </p>
            </div>
            <div className="meBlock flex-1">
              <p className="font-medium text-3xl lg:text-2xl leading-normal">
                现在，担任公立学校编制内的教师
              </p>
            </div>
            <div className="meBlock flex-1">
              <p className="font-medium text-3xl lg:text-2xl leading-normal">
                学高为师，身正为范
              </p>
            </div>
          </div>

          <div className="marqueeBox w-full overflow-hidden absolute left-0 bottom-4 flex items-center">
            <div
              ref={marqueeTrackRef}
              className="marqueeTrack flex gap-4 will-change-transform"
            >
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt1.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt2.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt3.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt4.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt5.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt6.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt7.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt8.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt9.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
              <div className="marqueeItem relative w-[400px] aspect-video rounded-sm overflow-hidden">
                <Image
                  src="/images/tt10.jpg"
                  alt=""
                  fill
                  className="object-cover object-[0%_40%]"
                />
              </div>
            </div>
          </div>

          <div
            ref={indicatorRef}
            className="scrollIndicator w-40 h-[0.1rem] absolute top-4 left-8 rounded-full bg-gray-300"
          >
            <span className="uppercase text-xs absolute -right-1/2 -translate-x-1/2 -top-1/2 -translate-y-1/3">
              scroll
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
