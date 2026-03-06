<script lang="ts">
	import SlideAnimator from './SlideAnimator.svelte';
	import type { Component } from 'svelte';

	type Props = {
		slides: Component[];
	};

	let { slides }: Props = $props();

	let index = $state(0);
	let direction = $state<'next' | 'prev' | null>(null);

	function goNext() {
		if (direction) return;
		if (index >= slides.length - 1) return;
		direction = 'next';
	}

	function goPrev() {
		if (direction) return;
		if (index <= 0) return;
		direction = 'prev';
	}

	function handleTransitionEnd() {
		if (direction === 'next') index += 1;
		if (direction === 'prev') index -= 1;
		direction = null;
	}
</script>

<button onclick={goPrev}>Prev</button>
<button onclick={goNext}>Next</button>

<SlideAnimator
	lastSlide={index > 0 ? slides[index - 1] : null}
	currentSlide={slides[index]}
	nextSlide={index < slides.length - 1 ? slides[index + 1] : null}
	currentKey={index}
	lastKey={index - 1}
	nextKey={index + 1}
	{direction}
	onTransitionEnd={handleTransitionEnd}
/>