// Product view initializer - stub
export interface ProductViewOptions {
  name: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
  modelUrl?: string;
}

export const initProductView = async (
  canvas: HTMLCanvasElement,
  options: ProductViewOptions
): Promise<() => void> => {
  console.warn('Product view WebGPU renderer not yet implemented');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#666';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${options.name} — 3D view coming soon`, canvas.width / 2, canvas.height / 2);
  }
  return () => {};
};
