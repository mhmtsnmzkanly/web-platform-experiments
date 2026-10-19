import { Complex } from '../types';

export const C = {
  zero: (): Complex => ({ re: 0, im: 0 }),
  one: (): Complex => ({ re: 1, im: 0 }),
  i: (): Complex => ({ re: 0, im: 1 }),

  create: (re: number, im: number = 0): Complex => ({ re, im }),

  add: (a: Complex, b: Complex): Complex => ({
    re: a.re + b.re,
    im: a.im + b.im,
  }),

  sub: (a: Complex, b: Complex): Complex => ({
    re: a.re - b.re,
    im: a.im - b.im,
  }),

  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),

  scale: (a: Complex, s: number): Complex => ({
    re: a.re * s,
    im: a.im * s,
  }),

  div: (a: Complex, b: Complex): Complex => {
    const denom = b.re * b.re + b.im * b.im;
    if (denom < 1e-15) return { re: 0, im: 0 };
    return {
      re: (a.re * b.re + a.im * b.im) / denom,
      im: (a.im * b.re - a.re * b.im) / denom,
    };
  },

  conj: (a: Complex): Complex => ({
    re: a.re,
    im: -a.im,
  }),

  magSq: (a: Complex): number => a.re * a.re + a.im * a.im,

  mag: (a: Complex): number => Math.sqrt(a.re * a.re + a.im * a.im),

  phase: (a: Complex): number => Math.atan2(a.im, a.re),

  polar: (r: number, theta: number): Complex => ({
    re: r * Math.cos(theta),
    im: r * Math.sin(theta),
  }),

  exp: (a: Complex): Complex => {
    const r = Math.exp(a.re);
    return {
      re: r * Math.cos(a.im),
      im: r * Math.sin(a.im),
    };
  },

  equals: (a: Complex, b: Complex, eps: number = 1e-6): boolean =>
    Math.abs(a.re - b.re) < eps && Math.abs(a.im - b.im) < eps,
};

/**
 * 2x2 Matrix Multiplication (C = A * B)
 */
export function matMul2x2(A: Complex[][], B: Complex[][]): Complex[][] {
  return [
    [
      C.add(C.mul(A[0][0], B[0][0]), C.mul(A[0][1], B[1][0])),
      C.add(C.mul(A[0][0], B[0][1]), C.mul(A[0][1], B[1][1])),
    ],
    [
      C.add(C.mul(A[1][0], B[0][0]), C.mul(A[1][1], B[1][0])),
      C.add(C.mul(A[1][0], B[0][1]), C.mul(A[1][1], B[1][1])),
    ],
  ];
}

/**
 * Kronecker Tensor Product: A ⊗ B
 */
export function tensorProduct(A: Complex[][], B: Complex[][]): Complex[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  const result: Complex[][] = Array.from({ length: rowsA * rowsB }, () =>
    Array.from({ length: colsA * colsB }, () => C.zero())
  );

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      for (let k = 0; k < rowsB; k++) {
        for (let l = 0; l < colsB; l++) {
          result[i * rowsB + k][j * colsB + l] = C.mul(A[i][j], B[k][l]);
        }
      }
    }
  }

  return result;
}
