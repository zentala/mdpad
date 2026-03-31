/**
 * Build content script — reads real .md files from the repo
 * and generates TypeScript source files to replace mock data.
 *
 * Usage: tsx scripts/build-content.ts
 */
import fs from 'node:fs'
import path from 'node:path'

interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  extension?: string
}

const INCLUDE_DIRS = ['.arch', '.plan']
const EXCLUDE_DIRS = ['node_modules', '.git', 'examples', 'prototype', '.claude']
const OUTPUT_DIR = path.join(import.meta.dirname, '..', 'src', 'generated')

/** Find repo root by walking upward looking for .git/ */
function findRepoRoot(startDir: string): string {
  let dir = startDir
  while (true) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) throw new Error('Could not find repo root (.git/)')
    dir = parent
  }
}

/** Normalize path to forward slashes */
function norm(p: string): string {
  return p.split(path.sep).join('/')
}

/** Collect .md files recursively from a directory */
function collectMdFiles(dirPath: string, basePath: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dirPath)) return results
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        results.push(...collectMdFiles(fullPath, basePath))
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(norm(path.relative(basePath, fullPath)))
    }
  }
  return results
}

/** Collect all target file paths from the repo */
function collectFilePaths(repoRoot: string): string[] {
  const files: string[] = []

  // Root-level .md files
  for (const entry of fs.readdirSync(repoRoot, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entry.name)
    }
  }

  // catalog-info.yaml
  const catalogPath = path.join(repoRoot, 'catalog-info.yaml')
  if (fs.existsSync(catalogPath)) files.push('catalog-info.yaml')

  // Include dirs recursively
  for (const dir of INCLUDE_DIRS) {
    files.push(...collectMdFiles(path.join(repoRoot, dir), repoRoot))
  }

  return files.sort()
}

interface TreeBuildNode {
  node: FileNode
  children: Map<string, TreeBuildNode>
}

/** Build a FileNode tree from flat file paths */
function buildFileTree(filePaths: string[]): FileNode[] {
  const root = new Map<string, TreeBuildNode>()

  for (const filePath of filePaths) {
    const parts = filePath.split('/')
    let currentChildren = root
    let currentPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isFile = i === parts.length - 1

      if (!currentChildren.has(part)) {
        const node: FileNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          ...(isFile ? { extension: path.extname(part).slice(1) || undefined } : {}),
          ...(!isFile ? { children: [] } : {}),
        }
        currentChildren.set(part, { node, children: new Map() })
      }

      if (!isFile) {
        currentChildren = currentChildren.get(part)!.children
      }
    }
  }

  return sortAndConvert(root)
}

/** Convert TreeBuildNode map to sorted FileNode arrays */
function sortAndConvert(map: Map<string, TreeBuildNode>): FileNode[] {
  const entries = Array.from(map.values())
  const folders = entries.filter((e) => e.node.type === 'folder')
  const files = entries.filter((e) => e.node.type === 'file')

  const byName = (a: TreeBuildNode, b: TreeBuildNode) => a.node.name.localeCompare(b.node.name)
  folders.sort(byName)
  files.sort(byName)

  for (const folder of folders) {
    folder.node.children = sortAndConvert(folder.children)
  }

  return [...folders, ...files].map((e) => e.node)
}

/** Read all file contents into a record */
function readFileContents(repoRoot: string, filePaths: string[]): Record<string, string> {
  const contents: Record<string, string> = {}
  for (const fp of filePaths) {
    const fullPath = path.join(repoRoot, fp)
    contents[fp] = fs.readFileSync(fullPath, 'utf-8')
  }
  return contents
}

/** Escape content for use inside template literals */
function escapeForTemplateLiteral(content: string): string {
  return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

/** Write the generated file-tree.ts */
function writeFileTree(tree: FileNode[]): void {
  const json = JSON.stringify(tree, null, 2)
  const content = [
    '// AUTO-GENERATED — do not edit manually',
    '',
    'import type { FileNode } from \'../types\'',
    '',
    `export const generatedFileTree: FileNode[] = ${json}`,
    '',
  ].join('\n')
  fs.writeFileSync(path.join(OUTPUT_DIR, 'file-tree.ts'), content)
}

/** Write the generated markdown-content.ts */
function writeMarkdownContent(files: Record<string, string>): void {
  const lines: string[] = [
    '// AUTO-GENERATED — do not edit manually',
    '',
    'export const generatedMarkdownFiles: Record<string, string> = {',
  ]

  for (const [fp, content] of Object.entries(files)) {
    lines.push(`  ${JSON.stringify(fp)}: \`${escapeForTemplateLiteral(content)}\`,`)
  }

  lines.push('}', '')
  lines.push("export const defaultFile = 'README.md'")
  lines.push('')

  fs.writeFileSync(path.join(OUTPUT_DIR, 'markdown-content.ts'), lines.join('\n'))
}

// --- Main ---
const scriptDir = import.meta.dirname
const contentDir = process.env.MDPAD_CONTENT_DIR
const repoRoot = contentDir ?? findRepoRoot(scriptDir)
console.log(`Repo root: ${repoRoot}`)

const filePaths = collectFilePaths(repoRoot)
console.log(`Found ${filePaths.length} files`)

const tree = buildFileTree(filePaths)
writeFileTree(tree)
console.log(`Wrote file-tree.ts`)

const contents = readFileContents(repoRoot, filePaths)
writeMarkdownContent(contents)
console.log(`Wrote markdown-content.ts`)
