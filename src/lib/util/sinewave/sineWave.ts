export type Point = { x: number; y: number }

export type SineWaveOptions = {
	amplitude: number
	wavelength: number
	time: number
	samples?: number
	startX?: number
	endX?: number
}

export function generateSineWave({
	amplitude,
	wavelength,
	time,
	samples = 100,
	startX = 0,
	endX = wavelength
}: SineWaveOptions): Point[] {
	if (samples <= 0) return []
	if (samples === 1) {
		const k = (2 * Math.PI) / wavelength
		const x = startX
		const y = amplitude * Math.sin(k * x + time)
		return [{ x, y }]
	}

	const points: Point[] = []
	const k = (2 * Math.PI) / wavelength
	const step = (endX - startX) / (samples - 1)

	for (let i = 0; i < samples; i++) {
		const x = startX + i * step
		const y = amplitude * Math.sin(k * x + time)
		points.push({ x, y })
	}

	return points
}
