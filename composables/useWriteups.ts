export type WriteupItem = {
    _path: string
    _dir: string
    title: string
    meta?: string // 'folder' | 'article'
    date?: string
}

export type WriteupFolder = WriteupItem & {
    articles: WriteupItem[]
}

export function useWriteups() {
    const { data: allItems } = useAsyncData('writeups-all', () =>
        queryContent('writeups')
            .only(['_path', '_dir', 'title', 'meta', 'date'])
            .find()
    )

    const tree = computed<WriteupFolder[]>(() => {
        const items = (allItems.value ?? []) as WriteupItem[]
        const folders = items
            .filter(i => i.meta === 'folder')
            .sort((a, b) => {
                if (a.date && b.date) return b.date.localeCompare(a.date)
                return (a.title ?? '').localeCompare(b.title ?? '')
            })
        return folders.map(folder => ({
            ...folder,
            articles: items
                .filter(i => i.meta !== 'folder' && i._dir === folder._path.split('/').at(-1))
                .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
        }))
    })

    const openFolders = ref<Set<string>>(new Set())

    function toggleFolder(dir: string) {
        if (openFolders.value.has(dir)) {
            openFolders.value.delete(dir)
        } else {
            openFolders.value.add(dir)
        }
    }

    function openAll() {
        tree.value.forEach(f => openFolders.value.add(f._path))
    }

    return { tree, openFolders, toggleFolder, openAll }
}