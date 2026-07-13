// server/api/argocd/index.ts
//
// Read-only list of ArgoCD applications, used to populate the app
// switcher sidebar. GET only.

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const base = config.argocdUrl?.replace(/\/$/, '')

    if (!base || !config.argocdToken) {
        throw createError({ statusCode: 500, statusMessage: 'ArgoCD is not configured on the server' })
    }

    const res = await fetch(`${base}/api/v1/applications`, {
        headers: {
            Authorization: `Bearer ${config.argocdToken}`,
            Accept: 'application/json',
        },
    })

    if (!res.ok) {
        throw createError({ statusCode: res.status, statusMessage: 'Failed to list ArgoCD applications' })
    }

    const data = await res.json()
    const items = data?.items ?? []

    return items.map((a: any) => ({
        name: a?.metadata?.name,
        project: a?.spec?.project,
        sync: a?.status?.sync?.status,
        health: a?.status?.health?.status,
    }))
})