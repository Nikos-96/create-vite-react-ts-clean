#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

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
		projectName = await ask('Project name (or . for current directory): ')
	}

	rl.close()

	projectName = projectName.trim() || 'my-app'

	const targetDir = projectName === '.'
		? process.cwd()
		: path.resolve(process.cwd(), projectName)

	const displayName = projectName === '.'
		? path.basename(process.cwd())
		: projectName

	if (projectName !== '.' && fs.existsSync(targetDir)) {
		console.error(`Error: directory "${projectName}" already exists.`)
		process.exit(1)
	}

	const templateDir = path.join(__dirname, 'template')

	copyDir(templateDir, targetDir)

	const pkgPath = path.join(targetDir, 'package.json')
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
	pkg.name = displayName
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

	const htmlPath = path.join(targetDir, 'index.html')
	let html = fs.readFileSync(htmlPath, 'utf-8')
	html = html.replace(/<title>.*<\/title>/, `<title>${displayName}</title>`)
	fs.writeFileSync(htmlPath, html)

	if (projectName !== '.') {
		process.chdir(targetDir)
	}

	console.log(`\nInstalling dependencies...\n`)
	execSync('npm install', { stdio: 'inherit' })

	console.log(`\nStarting dev server...\n`)
	execSync('npm run dev', { stdio: 'inherit' })
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