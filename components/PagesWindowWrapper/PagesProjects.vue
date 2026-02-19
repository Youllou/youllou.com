<script setup lang="ts">
import { ref, onMounted } from 'vue'

const githubUrl = 'https://github.com/Youllou'

type Repo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
}

const repos = ref<Repo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchRepos() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('https://api.github.com/users/Youllou/repos?per_page=100&sort=updated')
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    repos.value = data.map((r: any) => ({
      id: r.id,
      name: r.name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      updated_at: r.updated_at,
    }))
  } catch (err: any) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => { void fetchRepos() })
</script>

<template>
  <div class="projects-wrapper">
    <div class="projects-header">
      <h3>GitHub — Youllou</h3>
      <div class="header-actions">
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="btn">Open GitHub</a>
        <button class="btn secondary" @click="fetchRepos">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="state">Loading repositories…</div>
    <div v-else-if="error" class="state error">Error: {{ error }}</div>
    <div v-else>
      <div v-if="repos.length === 0" class="state">No public repositories found.</div>
      <ul class="repo-list">
        <li v-for="repo in repos" :key="repo.id" class="repo-card">
          <a :href="repo.html_url" target="_blank" rel="noopener noreferrer" class="repo-title">{{ repo.name }}</a>
          <p class="repo-desc">{{ repo.description || 'No description' }}</p>
          <div class="repo-meta">
            <span class="lang" v-if="repo.language">{{ repo.language }}</span>
            <span class="stars">⭐ {{ repo.stargazers_count }}</span>
            <span class="updated">Updated {{ new Date(repo.updated_at).toLocaleDateString() }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.projects-wrapper {
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02));
}
.projects-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.header-actions { display: flex; gap: 8px; }
.btn {
  background: #2ea44f;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.btn.secondary { background: rgba(255,255,255,0.06); color: #ddd; }
.state { color: #ccc; padding: 8px 0; }
.state.error { color: #ffb4b4; }
.repo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.repo-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.03);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.repo-title { color: #9bd0a8; font-weight: 700; text-decoration: none; }
.repo-desc { color: #cfcfcf; font-size: 13px; margin: 0; }
.repo-meta { display: flex; gap: 8px; font-size: 12px; color: #bfbfbf; margin-top: auto; }
</style>