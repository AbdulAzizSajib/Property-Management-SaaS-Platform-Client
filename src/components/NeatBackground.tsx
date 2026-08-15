"use client";

import { NeatGradient, type NeatConfig } from "@firecms/neat";
import { useEffect, useRef } from "react";

const config: NeatConfig = {
    colors: [
        { color: "#082F49", enabled: true }, // deep navy
        { color: "#0C4A6E", enabled: true }, // sky-900
        { color: "#075985", enabled: true }, // sky-800
        { color: "#0369A1", enabled: true }, // sky-700
        { color: "#0EA5E9", enabled: true }, // sky-500 — controlled highlight
    ],

    speed: 2.2,

    horizontalPressure: 2,
    verticalPressure: 4,

    waveFrequencyX: 4,
    waveFrequencyY: 4,
    waveAmplitude: 5,

    shadows: 2,
    highlights: 3,

    colorBrightness: 0.8,
    colorSaturation: 5,

    wireframe: false,
    colorBlending: 3,

    // Dark background
    backgroundColor: "#faf6ec",
    backgroundAlpha: 1,

    grainScale: 0,
    grainSparsity: 0,
    grainIntensity: 0,
    grainSpeed: 1,

    resolution: 0.65,

    yOffset: 0,
    yOffsetWaveMultiplier: 4,
    yOffsetColorMultiplier: 5,
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

    proceduralBackgroundColor: "#020617",

    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,

    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,

    vignetteIntensity: 0.15,
    vignetteRadius: 0.75,

    fresnelEnabled: true,
    fresnelPower: 3,
    fresnelIntensity: 0.3,
    fresnelColor: "#0284C7",

    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,

    bloomIntensity: 0,
    bloomThreshold: 0.95,

    chromaticAberration: 0.5,

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

    silhouetteFade: 0.3,
    cylinderFade: 0.08,
    ribbonFade: 0.05,

    flatShading: false,

    cameraLock: false,

    cameraX: 0,
    cameraY: -10,
    cameraZ: 0,

    cameraRotationX: 0,
    cameraRotationY: 0,
    cameraRotationZ: 0,

    cameraZoom: 4.4,

    // licenseKey: "NEAT-xxx.yyy",
};

export default function NeatBackground({
    className,
}: {
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const gradient = new NeatGradient({
            ref: canvasRef.current,
            ...config,
        });

        return () => {
            gradient.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
}