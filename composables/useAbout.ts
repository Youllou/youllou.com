export type TimelineItem = {
    title: string
    startDate: string
    endDate?: string
    description: string
    inverted?: boolean
    link?: string
}

export type TocItem = {
    title: string
    link: string
}

/**
 * Extracts the raw value from a nuxt-i18n tm() node,
 * which wraps strings in { b: { s }, body: { static } } depending on context.
 */
function extractTmValue(node: any): string | undefined {
    if (!node) return undefined
    return node.b?.s ?? node.body?.static ?? undefined
}

export function useAbout() {
    const { locale, locales, setLocale, t, tm } = useI18n()

    // ── Locale switcher ───────────────────────────────────────────
    const localeItems = computed(() =>
        locales.value.reduce<Record<string, string>>((acc, loc) => {
            if(loc.code && loc.name){
                acc[loc.code] = loc.name
            }
            return acc
        }, {})
    )

    const localeValue = computed({
        get: () => locale.value,
        set: (val) => setLocale(val),
    })

    // ── TOC ───────────────────────────────────────────────────────
    const toc = computed<TocItem[]>(() => [
        { title: t('about.toc.introduction'), link: '#introduction' },
        { title: t('about.toc.timeline'),     link: '#timeline' },
        { title: t('about.toc.projects'),     link: '#projects' },
        { title: t('about.toc.contacts'),     link: '#contacts' },
    ])

    // ── Timeline ─────────────────────────────────────────────────
    const timelineItems = computed<TimelineItem[]>(() => {
        const raw = tm('about.timeline.items') as any[]
        return raw.map((item, i) => ({
            title:       extractTmValue(item.title)       ?? '',
            startDate:   extractTmValue(item.startDate)   ?? '',
            endDate:     extractTmValue(item.endDate),
            description: extractTmValue(item.description) ?? '',
            inverted:    extractTmValue(item.inverted) === 'true' || (i % 2 === 1),
            link:        extractTmValue(item.link),
        }))
    })

    // ── GitHub projects ───────────────────────────────────────────
    const { data: githubData, pending: githubPending } = useFetch('/api/github')
    const projects = computed(() => githubData.value ?? [])

    // ── Mobile detection (client-only) ───────────────────────────
    const isMobile = ref(false)
    onMounted(() => {
        isMobile.value = window.screen.width <= 768
    })

    return {
        // locale
        localeItems,
        localeValue,
        // content
        toc,
        timelineItems,
        projects,
        githubPending,
        // layout
        isMobile,
    }
}