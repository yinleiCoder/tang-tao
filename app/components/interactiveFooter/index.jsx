"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import Image from "next/image";
import Matter, { Engine } from "matter-js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function InteractiveFooter() {
  const lenisRef = useRef();
  const footerRef = useRef();
  const objectContainerRef = useRef();

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
      let animateOnScroll = true;
      const config = {
        gravity: { x: 0, y: 1 },
        restitution: 0.5,
        friction: 0.15,
        frictionAir: 0.02,
        density: 0.002,
        wallThickness: 200,
        mouseStiffness: 0.6,
      };
      let engine,
        runner,
        mouseConstraint,
        bodies = [],
        topWall = null;

      const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

      const initPhysics = (container) => {
        engine = Engine.create();
        engine.gravity = config.gravity;
        engine.constraintIterations = 10;
        engine.positionIterations = 20;
        engine.velocityIterations = 16;
        engine.timing.timeScale = 1;

        const containerRect = container.getBoundingClientRect();
        const wallThickness = config.wallThickness;

        const walls = [
          Matter.Bodies.rectangle(
            containerRect.width / 2,
            containerRect.height + wallThickness / 2,
            containerRect.width + wallThickness * 2,
            wallThickness,
            {
              isStatic: true,
            }
          ),
          Matter.Bodies.rectangle(
            -wallThickness / 2,
            containerRect.height / 2,
            wallThickness,
            containerRect.height + wallThickness * 2,
            {
              isStatic: true,
            }
          ),
          Matter.Bodies.rectangle(
            containerRect.width + wallThickness / 2,
            containerRect.height / 2,
            wallThickness,
            containerRect.height + wallThickness * 2,
            {
              isStatic: true,
            }
          ),
        ];

        Matter.World.add(engine.world, walls);

        const objects = container.querySelectorAll(".object");
        objects.forEach((obj, index) => {
          const objRect = obj.getBoundingClientRect();

          const startX =
            Math.random() * (containerRect.width - objRect.width) +
            objRect.width / 2;
          const startY = -500 - index * 200;
          const startRotation = (Math.random() - 0.5) * Math.PI;

          const body = Matter.Bodies.rectangle(
            startX,
            startY,
            objRect.width,
            objRect.height,
            {
              restitution: config.restitution,
              friction: config.friction,
              frictionAir: config.frictionAir,
              density: config.density,
            }
          );
          Matter.Body.setAngle(body, startRotation);

          bodies.push({
            body: body,
            element: obj,
            width: objRect.width,
            height: objRect.height,
          });

          Matter.World.add(engine.world, body);
        });

        setTimeout(() => {
          topWall = Matter.Bodies.rectangle(
            containerRect.width / 2,
            -wallThickness / 2,
            containerRect.width + wallThickness * 2,
            wallThickness,
            {
              isStatic: true,
            }
          );
          Matter.World.add(engine.world, topWall);
        }, 3000);

        const mouse = Matter.Mouse.create(container);
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: config.mouseStiffness,
            render: { visible: false },
          },
        });
        mouseConstraint.mouse.element.oncontextmenu = () => false;

        let dragging = null;
        let originalInertia = null;
        Matter.Events.on(mouseConstraint, "startdrag", function (event) {
          dragging = event.body;
          if (dragging) {
            originalInertia = dragging.inertia;
            Matter.Body.setInertia(dragging, Infinity);
            Matter.Body.setVelocity(dragging, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(dragging, 0);
          }
        });
        Matter.Events.on(mouseConstraint, "enddrag", function (event) {
          if (dragging) {
            Matter.Body.setInertia(dragging, originalInertia || 1);
            dragging = null;
            originalInertia = null;
          }
        });

        Matter.Events.on(mouseConstraint, "beforeUpdate", function () {
          if (dragging) {
            const found = bodies.find((b) => b.body === dragging);
            if (found) {
              const minX = found.width / 2;
              const maxX = containerRect.width - found.width / 2;
              const minY = found.height / 2;
              const maxY = containerRect.height - found.height / 2;

              Matter.Body.setPosition(dragging, {
                x: clamp(dragging.position.x, minX, maxX),
                y: clamp(dragging.position.y, minY, maxY),
              });
              Matter.Body.setVelocity(dragging, {
                x: clamp(dragging.velocity.x, -20, 20),
                y: clamp(dragging.velocity.y, -20, 20),
              });
            }
          }
        });

        container.addEventListener("mouseleave", () => {
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.constraint.pointB = null;
        });

        document.addEventListener("mouseleave", () => {
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.constraint.pointB = null;
        });
        Matter.World.add(engine.world, mouseConstraint);

        runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        function updatePositions() {
          bodies.forEach(({ body, element, width, height }) => {
            const x = clamp(
              body.position.x - width / 2,
              0,
              containerRect.width - width
            );
            const y = clamp(
              body.position.y - height / 2,
              -height * 3,
              containerRect.height - height
            );

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.transform = `rotate(${body.angle}rad)`;
          });
          requestAnimationFrame(updatePositions);
        }

        updatePositions();
      };

      ScrollTrigger.create({
        trigger: objectContainerRef.current,
        start: "top bottom",
        once: true,
        // markers: true,
        onEnter: () => {
          const container = objectContainerRef.current;
          if (container && !engine) {
            initPhysics(container);
          }
        },
      });
    },
    { scope: footerRef, dependencies: [] }
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full h-svh p-4 overflow-hidden bg-[#0f0f0f] text-white"
    >
      <div
        ref={objectContainerRef}
        className="objectContainer absolute top-0 left-0 w-full h-full"
      >
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>尹</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>磊</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>唐</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>涛</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>爱</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>喜欢</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>我</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>你</p>
        </div>
        <div className="object absolute max-w-max aspect-square text-sm md:text-2xl font-semibold bg-white text-[#0f0f0f] p-4 flex justify-center items-center rounded-md cursor-grab select-none pointer-events-auto z-30 active:cursor-grabbing">
          <p>永远</p>
        </div>
      </div>

      <div className="footerContent absolute top-0 left-0 w-full h-full p-4 flex justify-center items-center pointer-events-none">
        <h1 className="text-2xl lg:text-5xl font-bold leading-normal tracking-[1.2] w-full lg:w-1/2 text-center pointer-events-auto">
          网站采用NextJs技术构建
        </h1>
      </div>
    </footer>
  );
}
