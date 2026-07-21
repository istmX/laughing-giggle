const appSources = import.meta.glob('../../../app/src/**/*.{tsx,ts,css}', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const knowledgeSources = import.meta.glob('../../../RAG_Service/context-engine/app/knowledge/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const rootSources = import.meta.glob('../../../app/*.{json,md}', {
  eager: true,
  import: 'default',
  query: '?raw',
});

function toPath(key, root) {
  return key.replace(root, '').replace(/^\//, '');
}

function toFile(path, content, source, language) {
  return { path, content: String(content), source, language };
}

const appFiles = Object.entries(appSources).map(([key, content]) => {
  const path = toPath(key, '../../../app/');
  const extension = path.split('.').pop();
  return toFile(path, content, `app/${path}`, extension === 'tsx' || extension === 'ts' ? 'typescript' : 'css');
});

const knowledgeEntries = Object.entries(knowledgeSources)
  .filter(([key]) => !key.includes('/knowledge/ui/'));

const agentEntry = knowledgeEntries.find(([key]) => key.endsWith('/Agents.md'));

const knowledgeFiles = knowledgeEntries
  .filter(([key]) => !key.endsWith('/Agents.md'))
  .map(([key, content]) => {
    const path = toPath(key, '../../../RAG_Service/context-engine/app/knowledge/');
    return toFile(`context/${path}`, content, `RAG_Service/context-engine/app/knowledge/${path}`, 'markdown');
  });

const rootFiles = Object.entries(rootSources).map(([key, content]) => {
  const path = toPath(key, '../../../app/');
  return toFile(path, content, `app/${path}`, path.endsWith('.json') ? 'json' : 'markdown');
}).filter((file) => file.path !== 'AGENTS.md');

const agentsFile = agentEntry
  ? toFile('AGENTS.md', agentEntry[1], 'RAG_Service/context-engine/app/knowledge/Agents.md', 'markdown')
  : null;

export const PRODUCT_FILES = [
  ...(agentsFile ? [agentsFile] : []),
  ...rootFiles,
  ...appFiles,
  ...knowledgeFiles,
];

export const FILE_GROUPS = [
  { label: 'app', files: appFiles.filter((file) => file.path.startsWith('src/app/')) },
  { label: 'components', files: appFiles.filter((file) => file.path.startsWith('src/components/')) },
  { label: 'constants', files: appFiles.filter((file) => file.path.startsWith('src/constants/')) },
  { label: 'hooks', files: appFiles.filter((file) => file.path.startsWith('src/hooks/')) },
  { label: 'context', files: knowledgeFiles },
];

export const PROJECT_ROOT_FILES = [
  ...(agentsFile ? [agentsFile] : []),
  ...rootFiles,
];

export function findProductFile(path) {
  return PRODUCT_FILES.find((file) => file.path === path) || PRODUCT_FILES[0];
}
