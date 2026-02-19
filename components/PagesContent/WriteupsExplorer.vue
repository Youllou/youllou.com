<script setup lang="ts">
import {useWriteups} from '@/composables/useWriteups'

/**
 * mode="inline"   → articles load in the right pane (used inside DesktopWindow)
 * mode="navigate" → clicking an article does NuxtLink navigation (used on standalone page)
 */
const props = withDefaults(
    defineProps<{ mode?: 'inline' | 'navigate' }>(),
    {mode: 'inline'}
)

const {tree, openFolders, toggleFolder, openAll} = useWriteups()

// Inline article state (only used in inline mode)
const selectedPath = ref<string | null>(null)
const {data: article, status} = useAsyncData(
    'writeup-article',
    () => selectedPath.value
        ? queryContent(selectedPath.value).findOne()
        : Promise.resolve(null),
    {watch: [selectedPath]}
)

function handleArticleClick(path: string) {
  if (props.mode === 'inline') {
    selectedPath.value = path
  }
  // navigate mode is handled by NuxtLink directly
}

// Deselect articles in closed folders
function handleToggle(path: string) {

  const folder = tree.value.find(f => f._path === path)
  toggleFolder(path)
  // If we just closed a folder, deselect any article inside it
  if (folder && !openFolders.value.has(path)) {
    if (selectedPath.value?.startsWith(folder._path + '/')) {
      selectedPath.value = null
    }
  }
}

onMounted(openAll)
</script>

<template>
  <div class="we-shell" :class="`we-mode-${mode}`">

    <!-- ── Left pane: file tree ───────────────────────────────── -->
    <nav class="we-tree" aria-label="Writeups file tree">
      <div class="we-tree-header">
        <span class="we-prompt">~/writeups</span>
        <span class="we-blink">▮</span>
      </div>

      <div class="we-tree-body">
        <div v-if="tree.length === 0" class="we-row we-empty-text">
          No writeups yet<span class="we-blink">_</span>
        </div>

        <div v-for="folder in tree" :key="folder._path" class="we-folder-block">
          <!-- Folder row -->
          <button
              class="we-row we-folder-row"
              :class="{ open: openFolders.has(folder._path) }"
              @click="handleToggle(folder._path)"
          >
            <span class="we-icon">{{ openFolders.has(folder._path) ? '▾' : '▸' }}</span>
            <span class="we-folder-icon">📁</span>
            <span class="we-label">{{ folder.title }}</span>
            <span v-if="folder.date" class="we-date">{{ folder.date?.slice(0, 10) }}</span>
          </button>

          <!-- Articles inside folder -->
          <Transition name="slide">
            <div v-if="openFolders.has(folder._path)" class="we-articles">
              <div v-if="folder.articles.length === 0" class="we-row we-no-articles">
                <span class="we-branch">└─</span>
                <span class="we-empty-label">(empty)</span>
              </div>

              <!-- navigate mode: NuxtLink -->
              <template v-if="mode === 'navigate'">
                <NuxtLink
                    v-for="(art, idx) in folder.articles"
                    :key="art._path"
                    :to="art._path"
                    class="we-row we-article-row"
                >
                  <span class="we-branch">{{ idx === folder.articles.length - 1 ? '└─' : '├─' }}</span>
                  <span class="we-file-icon">📄</span>
                  <span class="we-label">{{ art.title }}</span>
                </NuxtLink>
              </template>

              <!-- inline mode: button -->
              <template v-else>
                <button
                    v-for="(art, idx) in folder.articles"
                    :key="art._path"
                    class="we-row we-article-row"
                    :class="{ active: selectedPath === art._path }"
                    @click="handleArticleClick(art._path)"
                >
                  <span class="we-branch">{{ idx === folder.articles.length - 1 ? '└─' : '├─' }}</span>
                  <span class="we-file-icon">📄</span>
                  <span class="we-label">{{ art.title }}</span>
                </button>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </nav>

    <!-- ── Divider ────────────────────────────────────────────── -->
    <div v-if="mode === 'inline'" class="we-divider"/>

    <!-- ── Right pane (inline mode only) ─────────────────────── -->
    <main v-if="mode === 'inline'" class="we-content">
      <div v-if="!selectedPath" class="we-splash">
        <pre class="we-ascii">
 _ _ _      _ _
| | | |_ _(_) |_ ___ _ _  _ __ ___
| | | | '_| |  _/ -_) '_|| '_ (_-<
|_____|_| |_|\__\___|_|  | .__/__/
                          |_|
        </pre>
        <p class="we-hint">← Select a writeup</p>
      </div>

      <div v-else-if="status === 'pending'" class="we-splash">
        <span class="we-loading">Loading<span class="we-dots">...</span></span>
      </div>

      <div v-else-if="article" class="we-article-wrap">
        <ContentRenderer :value="article" class="we-prose"/>
      </div>

      <div v-else class="we-splash">
        <p class="we-hint">Could not load article.</p>
      </div>
    </main>

  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────────────── */
.we-shell {
  display: flex;
  height: 100%;
  background: #000;
  font-family: 'Press Start 2P', monospace;
  color: #a020f0;
  overflow: hidden;
}

/* Standalone page mode: tree is full-width, centered */
.we-mode-navigate {
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 5vh 5vw;
  box-sizing: border-box;
}

.we-mode-navigate .we-tree {
  width: 100%;
  max-width: 700px;
  border: 1px solid #330033;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(160, 32, 240, 0.15);
}

/* ── Tree ────────────────────────────────────────────────────── */
.we-tree {
  width: 260px;
  min-width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* In inline mode the tree has a right border */
.we-mode-inline .we-tree {
  border-right: 1px solid #2a002a;
}

.we-tree-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid #2a002a;
  font-size: 8px;
  color: #cc44cc;
  background: #0a000a;
  flex-shrink: 0;
}

.we-blink {
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.we-tree-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: #3a003a #000;
}

/* ── Rows ────────────────────────────────────────────────────── */
.we-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  font-family: 'Press Start 2P', monospace;
  font-size: 7px;
  line-height: 1.6;
  color: #a020f0;
  text-decoration: none;
  transition: background 0.1s;
  white-space: nowrap;
  overflow: hidden;
}

.we-row:hover {
  background: rgba(160, 32, 240, 0.1);
}

.we-folder-row {
  font-size: 8px;
  color: #cc44cc;
}

.we-folder-row.open {
  color: #ff66ff;
}

.we-article-row {
  padding-left: 18px;
}

.we-article-row.active {
  background: rgba(160, 32, 240, 0.2);
  color: #fff;
}

.we-no-articles {
  color: #440044;
  cursor: default;
}

.we-no-articles:hover {
  background: none;
}

.we-icon {
  font-size: 9px;
  width: 12px;
  flex-shrink: 0;
}

.we-folder-icon, .we-file-icon {
  font-size: 11px;
  flex-shrink: 0;
}

.we-label {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.we-date {
  font-size: 6px;
  color: #660066;
  flex-shrink: 0;
}

.we-branch {
  font-family: monospace;
  font-size: 11px;
  color: #440044;
  flex-shrink: 0;
}

.we-empty-label {
  color: #440044;
  font-size: 6px;
}

.we-empty-text {
  color: #660066;
}

/* ── Slide transition ────────────────────────────────────────── */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 600px;
  overflow: hidden;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ── Divider ─────────────────────────────────────────────────── */
.we-divider {
  width: 1px;
  background: #1a001a;
  flex-shrink: 0;
}

/* ── Right pane ──────────────────────────────────────────────── */
.we-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3a003a #000;
  display: flex;
  flex-direction: column;
}

.we-splash {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px;
}

.we-ascii {
  color: #440044;
  font-size: 7px;
  line-height: 1.8;
  text-align: center;
  white-space: pre;
}

.we-hint {
  color: #660066;
  font-size: 8px;
}

.we-loading {
  color: #a020f0;
  font-size: 9px;
  animation: pulse 1.5s ease-in-out infinite;
}

.we-dots {
  display: inline-block;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.we-article-wrap {
  padding: 20px 28px 40px;
}
</style>

<!-- Unscoped: styles for ContentRenderer children -->
<style>
.we-prose {
  color: #cccccc;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.72rem;
  line-height: 2;
}

.we-prose h1 {
  font-size: 1.1rem !important;
  color: #a020f0;
  text-decoration: underline;
  text-decoration-color: #a020f0;
  margin: 0 0 1.2rem;
}

.we-prose h2 {
  font-size: 0.85rem;
  color: #cc44cc;
  text-decoration: underline;
  text-decoration-color: #660066;
  margin: 2rem 0 0.8rem;
}

.we-prose h3 {
  font-size: 0.75rem;
  color: #cc44cc;
  margin: 1.5rem 0 0.6rem;
}

.we-prose p {
  margin: 0.8rem 0;
}

.we-prose a {
  color: #a020f0;
  text-decoration: underline;
}

.we-prose a:hover {
  color: #ff66ff;
}

.we-prose code {
  background: #0d000d;
  color: #cc44cc;
  border: 1px solid #330033;
  border-radius: 3px;
  padding: 1px 5px;
  font-family: 'Proto Nerd Font', 'Courier New', monospace;
  font-size: 0.85em;
}

.we-prose pre {
  background: #080008;
  border: 1px solid #330033;
  border-left: 3px solid #a020f0;
  border-radius: 4px;
  padding: 14px 16px;
  overflow-x: auto;
  margin: 1rem 0;
}

.we-prose pre code {
  background: none;
  border: none;
  padding: 0;
  color: #cc99ff;
  font-family: 'Proto Nerd Font', 'Courier New', monospace;
  font-size: 0.8rem;
}

.we-prose ul {
  list-style-type: '- ';
  padding-left: 2rem;
  margin: 0.6rem 0;
}

.we-prose li {
  margin: 0.4rem 0;
}

.we-prose hr {
  border: none;
  border-top: 1px solid #330033;
  margin: 1.5rem 0;
}

.we-prose img {
  max-width: 100%;
  width: 70%;
  border: 1px solid #330033;
  border-radius: 4px;
  margin: 1rem auto;
  display: block;
}

.we-prose blockquote, .we-prose .subtitle {
  color: #888;
  font-size: 0.65rem;
  border-left: 3px solid #440044;
  padding-left: 12px;
  margin: 0.6rem 0;
}

.we-prose strong, .we-prose em {
  color: #dd88ff;
}

@font-face {
  font-family: 'Proto Nerd Font';
  src: url('/assets/fonts/0xProtoNerdFont-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.language-sh code {
  font-family: "Proto Nerd Font", monospace;
}
</style>