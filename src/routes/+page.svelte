<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'

	const login = () => {
		// No real auth yet — just follow the sign to /welcome.
		void goto(resolve("/(protected)/deck_test"));
	};
</script>

<div class="wrap">
	<h1>Welcome to the Beige Zone</h1>

	<p>Congratulations. You found the page with the personality of I told an LLM to write this bit.</p>

	<p>
		It’s boring because you’re not logged in, which means the app can’t get your
		<strong>magic ID code</strong> (a GUID).
	</p>

	<button type="button" class="btn" onclick={login}>
		Log in and receive your Official Magic ID Code™
	</button>

	<small class="fineprint">
		I don’t need your name, email, or life story. Logging in just gives the app a unique ID so it
		can tell players apart when people join the same room code.
		<br /><br />
		I don’t care who you are — the app just needs a way to tell which player is which.
	</small>
</div>

<style>
	.wrap {
		max-width: 60ch;
		padding: 1.5rem;
		display: grid;
		gap: 0.9rem;
		border: 1px solid currentColor;
		border-radius: 1rem;
	}

	h1 {
		margin: 0;
	}

	.btn {
		justify-self: start;
		padding: 0.6rem 1rem;
		border-radius: 999px;
		border: 1px solid currentColor;
		background: transparent;
		cursor: pointer;
	}

	.btn:hover {
		transform: translateY(-1px);
	}

	.btn:active {
		transform: translateY(0);
	}

	.fineprint {
		opacity: 0.85;
		line-height: 1.4;
	}
</style>
