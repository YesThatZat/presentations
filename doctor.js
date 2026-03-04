#!/usr/bin/env node
import { rmSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

function run(cmd) {
	console.log(`\n> ${cmd}`)
	execSync(cmd, { stdio: 'inherit' })
}

function remove(path) {
	if (existsSync(path)) {
		console.log(`\n> rm -rf ${path}`)
		rmSync(path, { recursive: true, force: true })
	}
}

try {
	console.log('=== JS Doctor ===')

	console.log("Deleting node modules")
	remove('node_modules')
	console.log("Deleting package-lock.json")
	remove('package-lock.json')
	console.log("Deleting sveltekit build output")
	remove('build')
	console.log("Deleting .svelte-kit cache")
	remove('.svelte-kit')
	
	console.log("Using npm-check-updates -u to upgrade dependencies")
	run('npx npm-check-updates -u')
	console.log("Installing updated dependencies")
	run('npm install')
	console.log("Synchronising Svelte-Kit types and cache")
	run('npx svelte-kit sync')

	console.log('\n✓ Doctor completed successfully')
} catch (err) {
	console.error('\n✗ Doctor failed')
	console.log(err)
	process.exit(1)
}
