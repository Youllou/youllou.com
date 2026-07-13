// server/api/argocd/[app].ts
//
// Read-only proxy to ArgoCD. Keeps the ArgoCD API token on the server —
// it is never sent to the client. Only GET endpoints are called here;
// there is no code path in this file capable of triggering a sync,
// delete, or any other mutating action, so it stays safe to expose
// even without extra RBAC on the token (though a read-only ArgoCD
// account is still recommended, see README notes).

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const appName = getRouterParam(event, 'app')

    if (!appName || !/^[a-zA-Z0-9._-]+$/.test(appName)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid app name' })
    }

    const base = config.argocdUrl?.replace(/\/$/, '')
    if (!base || !config.argocdToken) {
        throw createError({ statusCode: 500, statusMessage: 'ArgoCD is not configured on the server' })
    }

    const headers = {
        Authorization: `Bearer ${config.argocdToken}`,
        Accept: 'application/json',
    }

    const [appRes, treeRes] = await Promise.all([
        fetch(`${base}/api/v1/applications/${encodeURIComponent(appName)}`, { headers }),
        fetch(`${base}/api/v1/applications/${encodeURIComponent(appName)}/resource-tree`, { headers }),
    ])

    if (!appRes.ok) {
        throw createError({ statusCode: appRes.status, statusMessage: 'Failed to fetch ArgoCD application' })
    }
    if (!treeRes.ok) {
        throw createError({ statusCode: treeRes.status, statusMessage: 'Failed to fetch ArgoCD resource tree' })
    }

    const app = await appRes.json()
    const tree = await treeRes.json()

    // Only pass through the fields the UI actually needs
    return {
        name: app?.metadata?.name,
        project: app?.spec?.project,
        sync: app?.status?.sync?.status,
        health: app?.status?.health?.status,
        images: app?.status?.summary?.images ?? [],
        repoURL: app?.spec?.source?.repoURL,
        targetRevision: app?.spec?.source?.targetRevision,
        nodes: tree?.nodes ?? [],
        orphanedNodes: tree?.orphanedNodes ?? [],
    }
})
