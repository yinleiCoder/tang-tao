"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function StackCards() {
  const lenisRef = useRef();
  const stackCardsRef = useRef();

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
      const cards = gsap.utils.toArray(".stackCard");
      const rotations = [-12, 10, -5, 5, -2];
      cards.forEach((card, index) => {
        gsap.set(card, {
          y: window.innerHeight,
          rotate: rotations[index],
        });
      });

      ScrollTrigger.create({
        trigger: stackCardsRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 8}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalCards = cards.length;
          const progressPerCard = 1 / totalCards;

          cards.forEach((card, index) => {
            const video = card.querySelector("video");
            const cardStart = index * progressPerCard;
            let cardProgress = (progress - cardStart) / progressPerCard;
            cardProgress = Math.min(Math.max(cardProgress, 0), 1);

            let yPosition = window.innerHeight * (1 - cardProgress);
            let xPosition = 0;

            if (cardProgress === 1 && index < totalCards - 1) {
              video.muted = true;
              video.loop = true;
              video.play();
              const remainingProgress =
                (progress - (cardStart + progressPerCard)) /
                (1 - (cardStart + progressPerCard));
              if (remainingProgress > 0) {
                const distanceMultiplier = 1 - index * 0.15;
                xPosition =
                  -window.innerWidth *
                  0.3 *
                  distanceMultiplier *
                  remainingProgress;
                yPosition =
                  -window.innerHeight *
                  0.3 *
                  distanceMultiplier *
                  remainingProgress;
              }
            } else {
              video.pause();
            }

            if (index === cards.length - 1) {
              video.muted = true;
              video.loop = true;
              video.play();
            }

            gsap.to(card, {
              x: xPosition,
              y: yPosition,
              duration: 0,
              ease: "none",
            });
          });
        },
      });
    },
    { scope: stackCardsRef, dependencies: [window] }
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <section
        ref={stackCardsRef}
        className="stackCards w-full h-svh relative overflow-hidden bg-[#fffef8]"
      >
        <div className="stackCard absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-1/4 h-2/3 p-2 flex flex-col gap-2 bg-[#202020] text-white">
          <div className="cardImg flex-[1,1,0] w-full min-h-0">
            <video src="/videos/1.mp4" className="w-full h-full object-cover" />
          </div>
          <div className="cardContent flex-[0,0,12px] flex items-center">
            <p className="uppercase text-lg">摄于遂宁市-涛妹26岁生日</p>
          </div>
        </div>
        <div className="stackCard absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-1/4 h-2/3 p-2 flex flex-col gap-2 bg-[#202020] text-white">
          <div className="cardImg flex-[1,1,0] w-full min-h-0">
            <video src="/videos/2.mp4" className="w-full h-full object-cover" />
          </div>
          <div className="cardContent flex-[0,0,12px] flex items-center">
            <p className="uppercase text-lg">摄于遂宁市杨渡街道办</p>
          </div>
        </div>
        <div className="stackCard absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-1/4 h-2/3 p-2 flex flex-col gap-2 bg-[#202020] text-white">
          <div className="cardImg flex-[1,1,0] w-full min-h-0">
            <video src="/videos/5.mp4" className="w-full h-full object-cover" />
          </div>
          <div className="cardContent flex-[0,0,12px] flex items-center">
            <p className="uppercase text-lg">摄于绵阳市三台县鲁班水库</p>
          </div>
        </div>
        <div className="stackCard absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-1/4 h-2/3 p-2 flex flex-col gap-2 bg-[#202020] text-white">
          <div className="cardImg flex-[1,1,0] w-full min-h-0">
            <video src="/videos/4.mp4" className="w-full h-full object-cover" />
          </div>
          <div className="cardContent flex-[0,0,12px] flex items-center">
            <p className="uppercase text-lg">摄于绵阳市三台县安置房-国庆节</p>
          </div>
        </div>
        <div className="stackCard absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform w-1/4 h-2/3 p-2 flex flex-col gap-2 bg-[#202020] text-white">
          <div className="cardImg flex-[1,1,0] w-full min-h-0">
            <video src="/videos/3.mp4" className="w-full h-full object-cover" />
          </div>
          <div className="cardContent flex-[0,0,12px] flex items-center">
            <p className="uppercase text-lg">摄于遂宁市灵泉寺</p>
          </div>
        </div>
      </section>
    </>
  );
}
