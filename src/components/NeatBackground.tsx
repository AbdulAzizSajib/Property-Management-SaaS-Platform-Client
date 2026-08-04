"use client";

import { NeatGradient, type NeatConfig } from "@firecms/neat";
import { useEffect, useRef } from "react";

// Config exported from https://neat.firecms.co
// Tweak the colors / values here to taste.
const config: NeatConfig = {
    colors: [
        { color: "#136A55", enabled: true }, // primary — jade
        { color: "#E85D44", enabled: true }, // primary — coral
        // { color: "#0A2E22", enabled: true }, // deep jade (shadow/contrast)
        // { color: "#1F9876", enabled: true }, // jade highlight
        { color: "#F47358", enabled: true }, // coral highlight
    ],
    speed: 2.5,
    horizontalPressure: 2,
    verticalPressure: 4,
    waveFrequencyX: 4,
    waveFrequencyY: 4,
    waveAmplitude: 6,
    shadows: 1,
    highlights: 5,
    colorBrightness: 1,
    colorSaturation: 7,
    wireframe: false,
    colorBlending: 4,
    // 136A55
    backgroundColor: "#f8f5eb",
    backgroundAlpha: 1,
    grainScale: 0,
    grainSparsity: 0,
    grainIntensity: 0,
    grainSpeed: 1,
    resolution: 0.65,
    yOffset: 0,
    yOffsetWaveMultiplier: 4,
    yOffsetColorMultiplier: 6.3,
    yOffsetFlowMultiplier: 4,
    flowDistortionA: 0,
    flowDistortionB: 0,
    flowScale: 1,
    flowEase: 0,
    flowEnabled: false,
    enableProceduralTexture: false,
    transparentTextureVoid: false,
    textureVoidLikelihood: 0.45,
    textureVoidWidthMin: 200,
    textureVoidWidthMax: 486,
    textureBandDensity: 2.15,
    textureColorBlending: 0.01,
    textureSeed: 333,
    textureEase: 0.5,
    proceduralBackgroundColor: "#000000",
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,
    vignetteIntensity: 0,
    vignetteRadius: 0.8,
    fresnelEnabled: true,
    fresnelPower: 2,
    fresnelIntensity: 0.6,
    fresnelColor: "#E85D44",
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    bloomIntensity: 0,
    bloomThreshold: 0.95,
    chromaticAberration: 1,
    shapeType: "sphere",
    shapeRotationX: 0,
    shapeRotationY: 0,
    shapeRotationZ: 0,
    shapeAutoRotateSpeedX: 0,
    shapeAutoRotateSpeedY: 0,
    sphereRadius: 15,
    torusRadius: 15,
    torusTube: 5,
    cylinderRadius: 10,
    cylinderHeight: 40,
    planeBend: 0,
    planeTwist: 0,
    silhouetteFade: 0.25,
    cylinderFade: 0.08,
    ribbonFade: 0.05,
    flatShading: false,
    cameraLock: false,
    cameraX: 0,
    cameraY: -12,
    cameraZ: 0,
    cameraRotationX: 0,
    cameraRotationY: 0,
    cameraRotationZ: 0,
    cameraZoom: 4.4,
    // licenseKey: "NEAT-xxx.yyy", // add to remove the watermark
};

export default function NeatBackground({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const gradient = new NeatGradient({ ref: canvasRef.current, ...config });
        // Clean up the WebGL context on unmount to avoid leaks.
        return () => gradient.destroy();
    }, []);

    return <canvas ref={canvasRef} className={className} />;
}
