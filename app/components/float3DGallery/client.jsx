"use client";

import "./index.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Float3DGallery() {
  const lenisRef = useRef();
  const stickyContainerRef = useRef();
  const titlesContainerRef = useRef();
  const imagesContainerRef = useRef();

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
      const cardPositions = [
        { top: "30%", left: "55%" },
        { top: "20%", left: "25%" },
        { top: "50%", left: "10%" },
        { top: "60%", left: "40%" },
        { top: "30%", left: "30%" },
        { top: "60%", left: "60%" },
        { top: "20%", left: "50%" },
        { top: "60%", left: "10%" },
        { top: "20%", left: "40%" },
        { top: "45%", left: "55%" },
      ];
      const titlesContainer = titlesContainerRef.current;
      const moveDistance = window.innerWidth * 3;
      const imagesContainer = imagesContainerRef.current;

      cardPositions.forEach((cardPosition, index) => {
        const card = document.createElement("div");
        card.className = `float3DCard float3DCard-${index}`;
        const img = document.createElement("img");
        img.src = `images/tt${index+20}.jpg`;
        img.alt = `Image ${index}`;
        card.appendChild(img);
        card.style.top = cardPosition.top;
        card.style.left = cardPosition.left;

        imagesContainer.appendChild(card);
      });

      const cards = document.querySelectorAll(".float3DCard");
      cards.forEach((card, index) => {
        gsap.set(card, {
          z: -50000,
          scale: 0,
        });
      });

      ScrollTrigger.create({
        trigger: stickyContainerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const xPosition = -moveDistance * self.progress;
          gsap.set(titlesContainer, {
            x: xPosition,
          });

          const velocity = self.getVelocity();
          const normalizedVelocity = velocity / Math.abs(velocity) || 0;
          const maxOffset = 30;
          const currentSpeed = Math.min(maxOffset, Math.abs(velocity / 500));

          const isAtEdge = self.progress <= 0 || self.progress >= 1;

          titlesContainer
            .querySelectorAll(".title")
            .forEach((titleContainer, index) => {
              const title1 = titleContainer.querySelector(".title-1");
              const title2 = titleContainer.querySelector(".title-2");
              const title3 = titleContainer.querySelector(".title-3");

              if (isAtEdge) {
                gsap.to([title1, title2], {
                  xPercent: -50,
                  x: 0,
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: true,
                });
              } else {
                const baseOffset = normalizedVelocity * currentSpeed;
                gsap.to(title1, {
                  xPercent: -50,
                  x: `${baseOffset * 4}}px`,
                  duration: 0.2,
                  ease: "power1.out",
                  overwrite: "auto",
                });
                gsap.to(title2, {
                  xPercent: -50,
                  x: `${baseOffset * 2}}px`,
                  duration: 0.2,
                  ease: "power1.out",
                  overwrite: "auto",
                });
              }

              gsap.set(title3, {
                xPercent: -50,
                x: 0,
              });
            });

          cards.forEach((card, index) => {
            const staggerOffset = index * 0.075;
            const scaledProgress = (self.progress - staggerOffset) * 3;
            const individualProgress = Math.max(0, Math.min(1, scaledProgress));
            const targetZ = index === cards.length - 1 ? 1500 : 2000;
            const newZ = -50000 + (targetZ + 50000) * individualProgress;
            const scaleProgress = Math.min(1, individualProgress * 10);
            const scale = Math.max(0, Math.min(1, scaleProgress));
            console.log(newZ, scale);
            gsap.set(card, {
              z: newZ,
              scale: scale,
            });
          });
        },
      });
    },
    { scope: stickyContainerRef, dependencies: [window] }
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <section
        ref={stickyContainerRef}
        className="stickyContainer relative w-full h-screen overflow-hidden bg-[#fffef8]"
      >
        <div
          ref={titlesContainerRef}
          className="titles absolute top-0 left-0 w-[400vw] h-screen flex will-change-transform"
        >
          <div className="title relative flex-1 flex justify-center items-center">
            <h1 className="title-1 uppercase font-semibold italic text-[#dafa6c] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Yin Lei
            </h1>
            <h1 className="title-2 uppercase font-semibold italic text-[#10d0f4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Yin Lei
            </h1>
            <h1 className="title-3 uppercase font-semibold italic text-[#1f1f1f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Yin Lei
            </h1>
          </div>
          <div className="title relative flex-1 flex justify-center items-center">
            <h1 className="title-1 uppercase font-semibold italic text-[#dafa6c] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Love
            </h1>
            <h1 className="title-2 uppercase font-semibold italic text-[#10d0f4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Love
            </h1>
            <h1 className="title-3 uppercase font-semibold italic text-[#1f1f1f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Love
            </h1>
          </div>
          <div className="title relative flex-1 flex justify-center items-center">
            <h1 className="title-1 uppercase font-semibold italic text-[#dafa6c] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Forever
            </h1>
            <h1 className="title-2 uppercase font-semibold italic text-[#10d0f4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Forever
            </h1>
            <h1 className="title-3 uppercase font-semibold italic text-[#1f1f1f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Forever
            </h1>
          </div>
          <div className="title relative flex-1 flex justify-center items-center">
            <h1 className="title-1 uppercase font-semibold italic text-[#dafa6c] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Tang Tao
            </h1>
            <h1 className="title-2 uppercase font-semibold italic text-[#10d0f4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Tang Tao
            </h1>
            <h1 className="title-3 uppercase font-semibold italic text-[#1f1f1f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9vw] will-change-transform">
              Tang Tao
            </h1>
          </div>
        </div>
        <div
          ref={imagesContainerRef}
          className="images absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250vw] h-[250vh] transform-3d perspective-[2000px] -z-10"
        ></div>
      </section>
    </>
  );
}
