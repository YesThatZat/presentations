<script lang="ts">
    // deck-test/+page.svelte
    import SlideDeck from "$lib/layout/SlideDeck.svelte";
    import Slide1 from "./slides/Slide1.svelte";
    import Slide2 from "./slides/Slide2.svelte";
    import Slide3 from "./slides/Slide3.svelte";
    import Slide4 from "./slides/Slide4.svelte";

    const slides = [Slide1, Slide2, Slide3, Slide4]
</script>

<div class="slides">
    <SlideDeck {slides} />
</div>

<style>
.slides {
    height: 100vh;
    width: 100vw;
    background-color: bisque;
}
</style>