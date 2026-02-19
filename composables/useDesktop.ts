export interface DesktopApp {
    id: string
    label: string
    icon: string // path to icon image or emoji
    component: string // component name to render inside window
}

export interface IconPosition {
    x: number
    y: number
}

export interface WindowState {
    id: string
    appId: string
    x: number
    y: number
    width: number
    height: number
    zIndex: number
    minimized: boolean
    maximized: boolean
    title: string
    icon: string
}

const STORAGE_KEY = 'desktop_icon_positions'
const windows = ref<WindowState[]>([])
let zCounter = 100

export function useDesktop() {
    // Icon positions
    function loadIconPositions(): Record<string, IconPosition> {
        if (!import.meta.client) return {}
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
        } catch {
            return {}
        }
    }

    function saveIconPosition(appId: string, pos: IconPosition) {
        if (!import.meta.client) return
        const all = loadIconPositions()
        all[appId] = pos
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    }

    function getIconPosition(appId: string, defaultPos: IconPosition): IconPosition {
        const all = loadIconPositions()
        return all[appId] ?? defaultPos
    }

    // Windows
    function openWindow(app: DesktopApp) {
        const existing = windows.value.find(w => w.appId === app.id)
        if (existing) {
            existing.minimized = false
            bringToFront(existing.id)
            return
        }

        zCounter++
        const id = `win-${Date.now()}`
        windows.value.push({
            id,
            appId: app.id,
            x: 80 + windows.value.length * 30,
            y: 60 + windows.value.length * 30,
            width: 800,
            height: 560,
            zIndex: zCounter,
            minimized: false,
            maximized: false,
            title: app.label,
            icon: app.icon,
        })
    }

    function closeWindow(id: string) {
        const idx = windows.value.findIndex(w => w.id === id)
        if (idx !== -1) windows.value.splice(idx, 1)
    }

    function minimizeWindow(id: string) {
        const win = windows.value.find(w => w.id === id)
        if (win) win.minimized = true
    }

    function toggleMaximize(id: string) {
        const win = windows.value.find(w => w.id === id)
        if (win) win.maximized = !win.maximized
    }

    function bringToFront(id: string) {
        zCounter++
        const win = windows.value.find(w => w.id === id)
        if (win) win.zIndex = zCounter
    }

    return {
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        bringToFront,
        getIconPosition,
        saveIconPosition,
    }
}