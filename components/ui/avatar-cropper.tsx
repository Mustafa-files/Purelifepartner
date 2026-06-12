"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

interface AvatarCropperProps {
  file: File;
  onCancel: () => void;
  onSave: (blob: Blob) => void;
  saving?: boolean;
}

const OUTPUT = 512; // exported avatar resolution

/**
 * Circular crop dialog shown after picking a profile photo.
 * Drag to reposition, slide to zoom; the circle previews exactly how the
 * photo will appear in profile circles. Exports a square JPEG via canvas.
 */
export function AvatarCropper({ file, onCancel, onSave, saving }: AvatarCropperProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewSize, setViewSize] = useState(320);
  const viewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (viewRef.current) setViewSize(viewRef.current.getBoundingClientRect().width);
  }, [src]);

  const baseScale = img
    ? Math.max(viewSize / img.naturalWidth, viewSize / img.naturalHeight)
    : 1;
  const scale = baseScale * zoom;

  function clampOffset(o: { x: number; y: number }, z: number) {
    if (!img) return o;
    const s = baseScale * z;
    const maxX = Math.max(0, (img.naturalWidth * s - viewSize) / 2);
    const maxY = Math.max(0, (img.naturalHeight * s - viewSize) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, o.x)),
      y: Math.min(maxY, Math.max(-maxY, o.y)),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    setOffset(
      clampOffset({ x: d.ox + (e.clientX - d.px), y: d.oy + (e.clientY - d.py) }, zoom)
    );
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function onZoom(z: number) {
    setZoom(z);
    setOffset((o) => clampOffset(o, z));
  }

  function confirmCrop() {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d")!;
    const srcSize = viewSize / scale;
    const sx = img.naturalWidth / 2 - offset.x / scale - srcSize / 2;
    const sy = img.naturalHeight / 2 - offset.y / scale - srcSize / 2;
    ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, OUTPUT, OUTPUT);
    canvas.toBlob((b) => b && onSave(b), "image/jpeg", 0.92);
  }

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-charcoal">Adjust your photo</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Drag to position and zoom until it looks right. The circle is exactly
          how it will appear on your profile.
        </p>

        <div
          ref={viewRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative mx-auto mt-5 aspect-square w-full max-w-[320px] cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-gray-100 active:cursor-grabbing"
        >
          {src && img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: img.naturalWidth * scale,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
          )}
          {/* Everything outside the circle is dimmed */}
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] ring-2 ring-white/80" />
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-charcoal">
            Zoom
            <span className="text-xs text-charcoal/50">{zoom.toFixed(1)}x</span>
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoom(parseFloat(e.target.value))}
            className="w-full accent-[#D5453A]"
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={confirmCrop} loading={saving} disabled={!img}>
            Save Photo
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
