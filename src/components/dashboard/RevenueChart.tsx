"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";

const data = [
    { month: "Jan", value: 245000 },
    { month: "Feb", value: 268000 },
    { month: "Mar", value: 254000 },
    { month: "Apr", value: 289000 },
    { month: "May", value: 312000 },
    { month: "Jun", value: 305000 },
    { month: "Jul", value: 334000 },
    { month: "Aug", value: 348000 },
    { month: "Sep", value: 361000 },
    { month: "Oct", value: 372000 },
    { month: "Nov", value: 389000 },
    { month: "Dec", value: 412000 },
];

export function RevenueChart() {
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const range = max - min || 1;

    const width = 600;
    const height = 220;
    const padX = 32;
    const padY = 24;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2;

    const points = data.map((d, i) => {
        const x = padX + (innerW / (data.length - 1)) * i;
        const y = padY + innerH - ((d.value - min) / range) * innerH;
        return { x, y, ...d };
    });

    const linePath = points
        .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
        .join(" ");

    const areaPath =
        linePath +
        ` L ${points[points.length - 1].x} ${padY + innerH}` +
        ` L ${points[0].x} ${padY + innerH} Z`;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const fmt = (n: number) =>
        new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            maximumFractionDigits: 0,
        }).format(n);

    return (
        <Card className="px-5">
            <CardHeader className="px-0">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <CardTitle>Revenue overview</CardTitle>
                        <CardDescription>Monthly collected rent, last 12 months</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500">Total this year</p>
                        <p className="text-lg font-semibold text-slate-900 tabular-nums">
                            {fmt(total)}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-56 w-full"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                        <line
                            key={t}
                            x1={padX}
                            x2={width - padX}
                            y1={padY + innerH * t}
                            y2={padY + innerH * t}
                            stroke="rgb(226 232 240)"
                            strokeDasharray="3 3"
                        />
                    ))}

                    <path d={areaPath} fill="url(#revGradient)" />
                    <path
                        d={linePath}
                        fill="none"
                        stroke="rgb(99 102 241)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {points.map((p) => (
                        <circle
                            key={p.month}
                            cx={p.x}
                            cy={p.y}
                            r="3.5"
                            fill="white"
                            stroke="rgb(99 102 241)"
                            strokeWidth="2"
                        />
                    ))}

                    {points.map((p, i) =>
                        i % 2 === 0 ? (
                            <text
                                key={p.month}
                                x={p.x}
                                y={height - 4}
                                textAnchor="middle"
                                fontSize="10"
                                fill="rgb(100 116 139)"
                            >
                                {p.month}
                            </text>
                        ) : null,
                    )}
                </svg>
            </CardContent>
        </Card>
    );
}
