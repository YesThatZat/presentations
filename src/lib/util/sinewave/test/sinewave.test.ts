import { describe, it, expect } from 'vitest'
import { generateSineWave } from '../sineWave' // adjust path to your project

describe('generateSineWave', () => {
	it('returns the requested number of samples', () => {
		const points = generateSineWave({
			amplitude: 1,
			wavelength: 10,
			time: 0,
			samples: 50
		})
		expect(points).toHaveLength(50)
	})

	it('generates x values evenly spaced across the range', () => {
		const points = generateSineWave({
			amplitude: 1,
			wavelength: 10,
			time: 0,
			samples: 5,
			startX: 0,
			endX: 10
		})

		expect(points.map(p => p.x)).toEqual([0, 2.5, 5, 7.5, 10])
	})

	it('respects amplitude (|y| <= amplitude)', () => {
		const amplitude = 5
		const points = generateSineWave({
			amplitude,
			wavelength: 10,
			time: 0,
			samples: 200
		})

		for (const { y } of points) {
			expect(Math.abs(y)).toBeLessThanOrEqual(amplitude + 1e-12)
		}
	})

	it('produces a known value at a known phase', () => {
		const wavelength = 2 * Math.PI
		const x = Math.PI / 2

		const points = generateSineWave({
			amplitude: 2,
			wavelength,
			time: 0,
			samples: 2,
			startX: x,
			endX: x // both points identical; avoids step issues
		})

		expect(points[0].y).toBeCloseTo(2, 6)
	})

	it('shifts the wave with time (away from zero-crossings)', () => {
		const wavelength = 10
		const quarter = wavelength / 4 // sin(2π * 1/4) = 1

		const base = generateSineWave({
			amplitude: 1,
			wavelength,
			time: 0,
			samples: 2,
			startX: quarter,
			endX: quarter
		})

		const shifted = generateSineWave({
			amplitude: 1,
			wavelength,
			time: Math.PI, // phase invert
			samples: 2,
			startX: quarter,
			endX: quarter
		})

		// base ≈ +1, shifted ≈ -1
		expect(base[0].y).toBeGreaterThan(0.9)
		expect(shifted[0].y).toBeLessThan(-0.9)
	})

	it('returns deterministic output for identical inputs', () => {
		const options = {
			amplitude: 3,
			wavelength: 12,
			time: 1.234,
			samples: 20
		} as const

		const a = generateSineWave(options)
		const b = generateSineWave(options)

		expect(a).toEqual(b)
	})

	it('returns ~0 everywhere when amplitude is 0', () => {
		const points = generateSineWave({
			amplitude: 0,
			wavelength: 10,
			time: 123,
			samples: 10
		})

		for (const p of points) {
			expect(p.y).toBeCloseTo(0, 12)
		}
	})

	it('handles samples=1', () => {
		const points = generateSineWave({
			amplitude: 2,
			wavelength: 10,
			time: 0,
			samples: 1,
			startX: 7,
			endX: 9
		})

		expect(points).toHaveLength(1)
		expect(points[0].x).toBe(7)
		expect(Number.isFinite(points[0].y)).toBe(true)
	})

	it('handles samples=0', () => {
		const points = generateSineWave({
			amplitude: 2,
			wavelength: 10,
			time: 0,
			samples: 0
		})
		expect(points).toEqual([])
	})
})
