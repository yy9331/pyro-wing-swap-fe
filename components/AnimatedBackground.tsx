'use client'

import { useCallback } from "react"
import { loadSlim } from "tsparticles-slim"
import { Engine } from "tsparticles-engine"
import Particles from "react-tsparticles"

// 火焰主题配置
export function FireAnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles-fire"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#f97316", "#f59e0b", "#eab308"],
          },
          links: {
            color: "#f97316",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "top",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 3,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.6,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 6 },
          },
          twinkle: {
            enable: true,
            frequency: 0.05,
            opacity: 1,
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  )
}
