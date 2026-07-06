
import { useMemo } from "react";
import { cn } from "@/lib/utils";


export function PerspectiveGrid({
    className,
    gridSize = 40,
    showOverlay = true,
    fadeRadius = 80
}) {
    const tiles = useMemo(() => Array.from({ length: gridSize * gridSize }), [gridSize]);

    return (
        <div
            className={cn(
                "relative h-full w-full overflow-hidden bg-background text-foreground",
                "[--fade-stop:var(--background)]",
                className
            )}
            style={{
                perspective: "2000px",
                transformStyle: "preserve-3d",
            }}>
            <div
                className="absolute w-[80rem] aspect-square grid origin-center"
                style={{
                    left: "50%",
                    top: "50%",
                    transform:
                        "translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)",
                    transformStyle: "preserve-3d",
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                }}>
                {/* Tiles */}
                {tiles.map((_, i) => (
                    <div
                        key={i}
                        className="tile min-h-[1px] min-w-[1px] border border-border/70 bg-transparent transition-colors duration-[1500ms] hover:duration-0" />
                ))}
            </div>
            {/* Radial Gradient Mask (Overlay) */}
            {showOverlay && (
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(circle, transparent 25%, var(--fade-stop) ${fadeRadius}%)`,
                    }} />
            )}
        </div>
    );
}

export default PerspectiveGrid;
