<script lang="ts">
	import type { Component } from 'svelte';

	type Direction = 'next' | 'prev' | null;

	type Props = {
		lastSlide: Component | null;
		currentSlide: Component;
		nextSlide: Component | null;
		lastKey: number;
		currentKey: number;
		nextKey: number;
		direction: Direction;
		onTransitionEnd?: () => void;
	};

	let {
		lastSlide : LastSlide,
		currentSlide : CurrentSlide,
		nextSlide : NextSlide,
		lastKey,
		currentKey,
		nextKey,
		direction,
		onTransitionEnd
	}: Props = $props();

	function handleTransitionEnd(event: TransitionEvent) {
		if (event.propertyName !== 'transform') return;
		if (!direction) return;
		if (event.target !== event.currentTarget) return;

		onTransitionEnd?.();
	}
</script>

<div class="slide-switcher">
	{#if LastSlide}
		{#key `last-${lastKey}`}
			<div
				class="slide"
				class:animating={!!direction}
				class:prev-slide={direction !== 'prev'}
				class:current-slide={direction === 'prev'}
				class:exit-to-left={direction === 'next'}
			>
				<LastSlide></LastSlide>
			</div>
		{/key}
	{/if}

	{#key `current-${currentKey}`}
		<div
			class="slide current-slide"
			class:animating={!!direction}
			class:exit-to-left={direction === 'next'}
			class:exit-to-right={direction === 'prev'}
			ontransitionend={handleTransitionEnd}
		>
			<CurrentSlide></CurrentSlide>
		</div>
	{/key}

	{#if NextSlide}
		{#key `next-${nextKey}`}
			<div
				class="slide"
				class:animating={!!direction}
				class:next-slide={direction !== 'next'}
				class:current-slide={direction === 'next'}
			>
				<NextSlide></NextSlide>
			</div>
		{/key}
	{/if}
</div>

<style>
	.slide-switcher {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.slide {
		position: absolute;
		inset: 0;
	}

	.slide.animating {
		transition: transform 1s ease-in-out;
	}

	.prev-slide {
		transform: translateX(-100%);
	}

	.current-slide {
		transform: translateX(0);
	}

	.next-slide {
		transform: translateX(100%);
	}

	.exit-to-left {
		transform: translateX(-100%);
	}

	.exit-to-right {
		transform: translateX(100%);
	}
</style>