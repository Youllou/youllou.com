<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { VueFlow, useVueFlow, Position, type Node, type Edge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

// Which app the graph currently shows — picked from the sidebar list.

type ArgoNode = {
  uid: string
  name: string
  namespace?: string
  kind: string
  group?: string
  version: string
  health?: { status: string; message?: string }
  parentRefs?: { uid: string }[]
}

type ArgoApp = {
  name: string
  project: string
  sync: string
  health: string
  images: string[]
  nodes: ArgoNode[]
}

// List of apps for the sidebar, and which one is currently shown.
type AppSummary = { name: string; project: string; sync: string; health: string }
const appList = ref<AppSummary[]>([])
const appListError = ref<string | null>(null)
const selectedAppName = ref<string | null>(null)

const app = ref<ArgoApp | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

const selected = ref<ArgoNode | null>(null)
const manifest = ref<any>(null)
const manifestLoading = ref(false)

const { fitView } = useVueFlow()

const healthColor: Record<string, string> = {
  Healthy: '#3fb950',
  Progressing: '#4c9eff',
  Degraded: '#f85149',
  Suspended: '#d29922',
  Missing: '#8b949e',
  Unknown: '#8b949e',
}

function colorFor(status?: string) {
  return healthColor[status ?? 'Unknown'] ?? healthColor.Unknown
}

async function loadAppList() {
  appListError.value = null
  try {
    const res = await fetch('/api/argocd')
    if (!res.ok) throw new Error(`ArgoCD API error: ${res.status}`)
    appList.value = await res.json()
  } catch (err: any) {
    appListError.value = err?.message || String(err)
  }
}

async function load(appName?: string) {
  const name = appName ?? selectedAppName.value
  if (!name) return
  selectedAppName.value = name
  loading.value = true
  error.value = null
  closePanel()
  try {
    const res = await fetch(`/api/argocd/${name}`)
    if (!res.ok) throw new Error(`ArgoCD API error: ${res.status}`)
    const data = await res.json()
    app.value = data
    buildGraph(data.nodes ?? [])
  } catch (err: any) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

function selectApp(name: string) {
  if (name === selectedAppName.value) return
  void load(name)
}

function buildGraph(argoNodes: ArgoNode[]) {
  const byUid = new Map(argoNodes.map(n => [n.uid, n]))

  // depth = distance from a root (a node with no known parent in this tree)
  const depth = new Map<string, number>()
  function depthOf(n: ArgoNode): number {
    if (depth.has(n.uid)) return depth.get(n.uid)!
    const parents = (n.parentRefs ?? []).filter(p => byUid.has(p.uid))
    const d = parents.length === 0 ? 0 : 1 + Math.max(...parents.map(p => depthOf(byUid.get(p.uid)!)))
    depth.set(n.uid, d)
    return d
  }
  argoNodes.forEach(depthOf)

  const columnCount = new Map<number, number>()
  const COL_W = 260
  const ROW_H = 90

  const newNodes: Node[] = argoNodes.map(n => {
    const d = depth.get(n.uid) ?? 0
    const row = columnCount.get(d) ?? 0
    columnCount.set(d, row + 1)

    return {
      id: n.uid,
      position: { x: d * COL_W, y: row * ROW_H },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { argo: n },
      type: 'default',
      label: `${n.kind}\n${n.name}`,
      style: {
        border: `2px solid ${colorFor(n.health?.status)}`,
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '12px',
        background: '#1e1e1e',
        color: '#eee',
        whiteSpace: 'pre-line',
        cursor: 'pointer',
        width: 200,
      },
    }
  })

  const newEdges: Edge[] = []
  argoNodes.forEach(n => {
    (n.parentRefs ?? []).forEach(p => {
      if (byUid.has(p.uid)) {
        newEdges.push({
          id: `${p.uid}-${n.uid}`,
          source: p.uid,
          target: n.uid,
          animated: n.health?.status === 'Progressing',
          style: { stroke: '#555' },
        })
      }
    })
  })

  nodes.value = newNodes
  edges.value = newEdges

  requestAnimationFrame(() => fitView({ padding: 0.2 }))
}

async function onNodeClick(event: { node: Node }) {
  const argo = event.node.data.argo as ArgoNode
  selected.value = argo
  manifest.value = null
  manifestLoading.value = true
  try {
    const params = new URLSearchParams({
      name: argo.name,
      kind: argo.kind,
      version: argo.version,
      ...(argo.namespace ? { namespace: argo.namespace } : {}),
      ...(argo.group ? { group: argo.group } : {}),
    })
    const res = await fetch(`/api/argocd/${selectedAppName.value}/resource?${params.toString()}`)
    if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
    const data = await res.json()
    manifest.value = data.manifest
  } catch (err: any) {
    manifest.value = { error: err?.message || String(err) }
  } finally {
    manifestLoading.value = false
  }
}

function closePanel() {
  selected.value = null
  manifest.value = null
}

onMounted(async () => {
  await loadAppList()
  if (appList.value.length > 0) {
    void load(appList.value[0].name)
  } else {
    loading.value = false
  }
})
</script>

<template>
  <div class="argo-wrapper">
    <!-- App switcher -->
    <div class="app-sidebar">
      <div class="sidebar-title">Applications</div>
      <div v-if="appListError" class="state error small">Error: {{ appListError }}</div>
      <button
          v-for="a in appList"
          :key="a.name"
          class="app-item"
          :class="{ active: a.name === selectedAppName }"
          @click="selectApp(a.name)"
      >
        <span class="dot" :style="{ background: colorFor(a.health) }" />
        <span class="app-item-name">{{ a.name }}</span>
      </button>
    </div>

    <div class="argo-main">
      <div class="argo-header">
        <div class="app-info" v-if="app">
          <span class="app-name">{{ app.name }}</span>
          <span class="badge" :style="{ background: colorFor(app.health) }">{{ app.health }}</span>
          <span class="badge sync">{{ app.sync }}</span>
        </div>
        <div class="header-actions">
          <button class="btn secondary" @click="load()">Refresh</button>
        </div>
      </div>

      <div v-if="loading" class="state">Loading resource tree…</div>
      <div v-else-if="error" class="state error">Error: {{ error }}</div>
      <div v-else-if="!selectedAppName" class="state">No ArgoCD applications found.</div>

      <div v-else class="graph-area">
        <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :nodes-draggable="true"
            :nodes-connectable="false"
            :edges-updatable="false"
            :elements-selectable="true"
            :zoom-on-scroll="true"
            @node-click="onNodeClick"
        >
          <Background pattern-color="#444" :gap="16" />
          <Controls :show-interactive="false" />
        </VueFlow>

        <!-- Read-only detail panel — no actions, just the live manifest -->
        <div v-if="selected" class="detail-panel">
          <div class="detail-header">
            <div>
              <div class="detail-kind">{{ selected.kind }}</div>
              <div class="detail-name">{{ selected.name }}</div>
            </div>
            <button class="btn secondary small" @click="closePanel">✕</button>
          </div>
          <div class="detail-health" :style="{ color: colorFor(selected.health?.status) }">
            {{ selected.health?.status || 'Unknown' }}
            <span v-if="selected.health?.message" class="detail-msg">— {{ selected.health.message }}</span>
          </div>
          <div v-if="manifestLoading" class="state">Loading manifest…</div>
          <pre v-else class="manifest">{{ JSON.stringify(manifest, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.argo-wrapper {
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #161616;
}
.app-sidebar {
  width: 180px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.08);
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sidebar-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #888;
  padding: 4px 6px 8px;
}
.app-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 6px 8px;
  color: #ccc;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  width: 100%;
}
.app-item:hover { background: rgba(255,255,255,0.06); }
.app-item.active { background: rgba(190,103,190,0.18); color: #fff; }
.app-item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.argo-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.argo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.app-info { display: flex; align-items: center; gap: 8px; }
.app-name { font-weight: 700; color: #eee; }
.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  color: #0a0a0a;
}
.badge.sync { background: #30363d; color: #eee; }
.btn.secondary {
  background: rgba(255,255,255,0.06);
  color: #ddd;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.btn.secondary.small { padding: 2px 8px; }
.state { color: #ccc; padding: 12px; }
.state.error { color: #ffb4b4; }
.state.small { padding: 6px; font-size: 11px; }
.graph-area {
  position: relative;
  flex: 1;
  min-height: 0;
}
.detail-panel {
  position: absolute;
  top: 8px;
  right: 8px;
  bottom: 8px;
  width: 340px;
  background: rgba(20,20,20,0.97);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 10px;
  overflow: auto;
  z-index: 10;
}
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.detail-kind { font-size: 11px; color: #999; text-transform: uppercase; }
.detail-name { font-weight: 700; color: #eee; word-break: break-all; }
.detail-health { font-size: 12px; margin: 6px 0 10px; }
.detail-msg { color: #aaa; }
.manifest {
  font-size: 11px;
  color: #cfcfcf;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>