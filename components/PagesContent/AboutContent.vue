<script setup lang="ts">
import { useAbout } from '~/composables/useAbout'

/**
 * mode="page"   → full-page layout with fixed TOC sidebar, locale switcher visible
 * mode="window" → compact layout that fits inside a DesktopWindow (no fixed positioning)
 */
const props = withDefaults(
    defineProps<{ mode?: 'page' | 'window' }>(),
    { mode: 'page' }
)

const {
  localeItems, localeValue,
  toc, timelineItems, projects, githubPending,
  isMobile,
} = useAbout()

const { t } = useI18n()
</script>

<template>
  <div class="ab-root" :class="`ab-mode-${mode}`">

    <!-- ── Locale switcher (page mode only) ───────────────────── -->
    <div v-if="mode === 'page'" class="ab-locale">
      <USelect
          v-model="localeValue"
          :items="Object.keys(localeItems)"
          @change="localeValue = $event"
      />
    </div>

    <!-- ── Mobile TOC (page mode only) ───────────────────────── -->
    <div v-if="mode === 'page'" class="ab-mobile-toc">
      <h2>{{ $t('about.toc.title') }}</h2>
      <ul class="ab-toc ab-toc--inline">
        <li v-for="item in toc" :key="item.link">
          <a :href="item.link">{{ item.title }}</a>
        </li>
      </ul>
    </div>

    <!-- ── Main grid ──────────────────────────────────────────── -->
    <div class="ab-grid">

      <!-- Content column -->
      <main class="ab-content">

        <!-- ── Introduction / Resume header ─────────────────── -->
        <section id="introduction" class="ab-section ab-intro">
          <div class="ab-intro-text">
            <h1>{{ $t('about.introduction.title') }}</h1>
            <p v-html="$t('about.introduction.content')" />
          </div>
          <div class="ab-intro-photo">
            <NuxtImg
                src="/assets/images/me.png"
                alt="Youllou"
                class="ab-avatar"
            />
          </div>
        </section>

        <div class="ab-divider" />

        <!-- ── Timeline / Experience ─────────────────────────── -->
        <section id="timeline" class="ab-section">
          <h1>{{ $t('about.timeline.title') }}</h1>
          <Timeline
              :items="timelineItems"
              :all-left="isMobile || mode === 'window'"
          />
        </section>

        <div class="ab-divider" />

        <!-- ── Projects ──────────────────────────────────────── -->
        <section id="projects" class="ab-section">
          <h1>{{ $t('about.projects.title') }}</h1>
          <p v-html="$t('about.projects.description')" />

          <div v-if="githubPending" class="ab-loading">Loading…</div>
          <div v-else class="ab-projects-grid">
            <div
                v-for="project in projects"
                :key="project.name"
                class="ab-project-card"
            >
              <div class="ab-project-top">
                <span class="ab-project-name">{{ project.name }}</span>
                <span v-if="project.language" class="ab-project-lang">{{ project.language }}</span>
              </div>
              <p class="ab-project-desc">{{ project.description || '—' }}</p>
              <div class="ab-project-footer">
                <span class="ab-project-stars">⭐ {{ project.stargazers_count }}</span>
                <a :href="project.html_url" target="_blank" rel="noopener noreferrer" class="ab-project-link">
                  View →
                </a>
              </div>
            </div>
          </div>
        </section>

        <div class="ab-divider" />

        <!-- ── Contacts ──────────────────────────────────────── -->
        <section id="contacts" class="ab-section ab-contacts">
          <h1>{{ $t('about.contacts.title') }}</h1>
          <p v-html="$t('about.contacts.description')" />
          <ul class="ab-contact-list">
            <li>
              <a href="https://www.linkedin.com/in/jules-barbier-bordere/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/icons/linkedin.svg" alt="LinkedIn" width="32" />
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/youllou" target="_blank" rel="noopener noreferrer">
                <img src="/assets/icons/github.svg" alt="GitHub" width="32" />
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/youl__lou" target="_blank" rel="noopener noreferrer">
                <img src="/assets/icons/instagram.svg" alt="Instagram" width="32" />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="/cdn-cgi/l/email-protection#a08f8fc3cfced4c1c3d4e0d9cfd5cccccfd58ec3cfcd">
                <img src="/assets/icons/mail.svg" alt="Email" width="32" />
                <span>Email</span>
              </a>
            </li>
          </ul>
        </section>

      </main>

      <!-- Sidebar TOC (page mode, desktop only) -->
      <aside v-if="mode === 'page'" class="ab-sidebar-toc">
        <h2>{{ $t('about.toc.title') }}</h2>
        <ul class="ab-toc">
          <li v-for="item in toc" :key="item.link">
            <a :href="item.link">{{ item.title }}</a>
          </li>
        </ul>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* ── Root ────────────────────────────────────────────────────── */
.ab-root {
  background-color: #2f2f2f;
  color: #cccccc;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.ab-mode-page {
  min-height: 100vh;
}

.ab-mode-window {
  height: 100%;
  overflow-y: auto;
}

/* ── Locale switcher ─────────────────────────────────────────── */
.ab-locale {
  position: absolute;
  top: 2rem;
  right: 3rem;
  z-index: 1000;
}

/* ── Mobile TOC ──────────────────────────────────────────────── */
.ab-mobile-toc {
  display: none;
  padding: 5% 5% 0;
}

@media (max-width: 768px) {
  .ab-mobile-toc { display: block; }
}

/* ── Grid layout ─────────────────────────────────────────────── */
.ab-grid {
  display: grid;
  grid-template-columns: 1fr;
  padding: 5%;
  gap: 2rem;
}

.ab-mode-page .ab-grid {
  grid-template-columns: 6fr 1fr;
}

@media (max-width: 768px) {
  .ab-mode-page .ab-grid {
    grid-template-columns: 1fr;
    padding: 0 0 5% 0;
  }
}

/* ── Content ─────────────────────────────────────────────────── */
.ab-content {
  min-width: 0; /* prevent grid blowout */
}

/* ── Sections ────────────────────────────────────────────────── */
.ab-section {
  padding: 1rem 0;
}

.ab-divider {
  border: none;
  border-top: 1px solid rgba(190, 103, 190, 0.2);
  margin: 1.5rem 0;
}

h1 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #eeeeee;
  text-decoration: underline;
  text-decoration-color: #be67be;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #eeeeee;
}

/* ── Intro / Resume header ───────────────────────────────────── */
.ab-intro {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 768px) {
  .ab-intro {
    grid-template-columns: 1fr;
    flex-direction: column-reverse;
  }
}

.ab-mode-window .ab-intro {
  grid-template-columns: 1fr;
}

.ab-avatar {
  border-radius: 12px;
  border: 3px solid rgba(190, 103, 190, 0.4);
  width: 100%;
  max-width: 220px;
  height: auto;
  display: block;
  margin: 0 auto 1rem;
}

.ab-contact-icons {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ab-contact-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(190, 103, 190, 0.1);
  border: 1px solid rgba(190, 103, 190, 0.2);
  transition: background 0.15s;
}

.ab-contact-icons a:hover {
  background: rgba(190, 103, 190, 0.25);
}

/* ── TOC sidebar ─────────────────────────────────────────────── */
.ab-sidebar-toc {
  position: fixed;
  top: calc(5% + 2rem);
  left: 82%;
  color: #cccccc;
}

@media (max-width: 768px) {
  .ab-sidebar-toc { display: none; }
}

.ab-toc {
  list-style: none;
  padding: 0;
}

.ab-toc li {
  margin: 0.5rem 0;
}

.ab-toc a {
  color: #cccccc;
  text-decoration: underline;
  text-decoration-color: #be67be;
  font-size: 0.9rem;
}

.ab-toc a:hover { color: #fff; }

.ab-toc--inline {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ── Projects ────────────────────────────────────────────────── */
.ab-loading {
  color: #888;
  padding: 1rem 0;
  font-size: 0.9rem;
}

.ab-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 1rem;
}

.ab-project-card {
  background: #1a1a1a;
  border: 1px solid rgba(190, 103, 190, 0.15);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
}

.ab-project-card:hover {
  border-color: rgba(190, 103, 190, 0.4);
}

.ab-project-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.ab-project-name {
  color: #eee;
  font-weight: 600;
  font-size: 0.9rem;
  word-break: break-word;
}

.ab-project-lang {
  font-size: 0.7rem;
  color: #be67be;
  background: rgba(190, 103, 190, 0.1);
  border: 1px solid rgba(190, 103, 190, 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.ab-project-desc {
  color: #aaa;
  font-size: 0.8rem;
  margin: 0;
  flex: 1;
  line-height: 1.5;
}

.ab-project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.ab-project-stars { color: #888; }

.ab-project-link {
  color: #be67be;
  text-decoration: underline;
}

.ab-project-link:hover { color: #dd99dd; }

/* ── Contacts ────────────────────────────────────────────────── */
.ab-contact-list {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.ab-contact-list a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cccccc;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s;
}

.ab-contact-list a:hover { color: #fff; }

.ab-contact-list span {
  text-decoration: underline;
  text-decoration-color: #be67be;
}
</style>