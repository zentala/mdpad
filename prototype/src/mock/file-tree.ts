import type { FileNode } from '@/types'

export const mockFileTree: FileNode[] = [
  {
    name: '.arch',
    path: '.arch',
    type: 'folder',
    children: [
      { name: 'ARCHITECTURE.md', path: '.arch/ARCHITECTURE.md', type: 'file', extension: 'md' },
      { name: 'HISTORY.md', path: '.arch/HISTORY.md', type: 'file', extension: 'md' },
      {
        name: 'ADR',
        path: '.arch/ADR',
        type: 'folder',
        children: [
          { name: '001-tauri-v2-runtime.md', path: '.arch/ADR/001-tauri-v2-runtime.md', type: 'file', extension: 'md' },
          { name: '002-comrak-parser.md', path: '.arch/ADR/002-comrak-parser.md', type: 'file', extension: 'md' },
        ],
      },
    ],
  },
  {
    name: '.plan',
    path: '.plan',
    type: 'folder',
    children: [
      { name: 'STATE.md', path: '.plan/STATE.md', type: 'file', extension: 'md' },
      { name: 'BACKLOG.md', path: '.plan/BACKLOG.md', type: 'file', extension: 'md' },
      { name: 'DONE.md', path: '.plan/DONE.md', type: 'file', extension: 'md' },
      {
        name: 'epics',
        path: '.plan/epics',
        type: 'folder',
        children: [
          {
            name: 'E001-project-bootstrap',
            path: '.plan/epics/E001-project-bootstrap',
            type: 'folder',
            children: [
              { name: 'PLAN.md', path: '.plan/epics/E001-project-bootstrap/PLAN.md', type: 'file', extension: 'md' },
              { name: 'ORCHESTRATOR.md', path: '.plan/epics/E001-project-bootstrap/ORCHESTRATOR.md', type: 'file', extension: 'md' },
              { name: 'JOURNAL.md', path: '.plan/epics/E001-project-bootstrap/JOURNAL.md', type: 'file', extension: 'md' },
            ],
          },
        ],
      },
    ],
  },
  { name: 'REFERENCE.md', path: 'REFERENCE.md', type: 'file', extension: 'md' },
  { name: 'README.md', path: 'README.md', type: 'file', extension: 'md' },
  { name: 'CLAUDE.md', path: 'CLAUDE.md', type: 'file', extension: 'md' },
  { name: 'catalog-info.yaml', path: 'catalog-info.yaml', type: 'file', extension: 'yaml' },
]
