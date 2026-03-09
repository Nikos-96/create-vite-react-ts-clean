#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

function ask(question) {
	return new Promise(resolve => rl.question(question, resolve))
}

async function main() {
	let projectName = process.argv[2]

	if (!projectName) {
		projectName = await ask('Project name: ')
	}

	rl.close()

	projectName = projectName.trim() || 'my-app'
	const targetDir = path.resolve(process.cwd(), projectName)

	if (fs.existsSync(targetDir)) {
		console.error(`Error: directory "${projectName}" already exists.`)
		process.exit(1)
	}

	const templateDir = path.join(__dirname, 'template')

	copyDir(templateDir, targetDir)

	// replace name in package.json
	const pkgPath = path.join(targetDir, 'package.json')
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
	pkg.name = projectName
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

	// replace title in index.html
	const htmlPath = path.join(targetDir, 'index.html')
	let html = fs.readFileSync(htmlPath, 'utf-8')
	html = html.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`)
	fs.writeFileSync(htmlPath, html)

	console.log(`\nDone! Now run:\n`)
	console.log(`  cd ${projectName}`)
	console.log(`  npm install`)
	console.log(`  npm run dev\n`)
}

function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true })
	for (const file of fs.readdirSync(src)) {
		const srcFile = path.join(src, file)
		const destFile = path.join(dest, file)
		const stat = fs.statSync(srcFile)
		if (stat.isDirectory()) {
			copyDir(srcFile, destFile)
		} else {
			fs.copyFileSync(srcFile, destFile)
		}
	}
}

main()