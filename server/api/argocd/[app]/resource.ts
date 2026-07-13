// server/api/argocd/[app]/resource.ts
//
// Read-only proxy for a single resource's live manifest, used when the
// user clicks a node in the graph. GET only — no mutating ArgoCD
// endpoint is ever called from this file.

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const appName = getRouterParam(event, 'app')
    const query = getQuery(event)

    if (!appName || !/^[a-zA-Z0-9._-]+$/.test(appName)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid app name' })
    }

    const { name, namespace, kind, group, version } = query as Record<string, string>
    if (!name || !kind || !version) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required query params: name, kind, version' })
    }

    const base = config.argocdUrl?.replace(/\/$/, '')
    const token = config.argocdToken

    if (!base || !token) {
        console.log('Missing ArgoCD configuration in runtime config')
        console.log(base)
        console.log(token)
        throw createError({ statusCode: 500, statusMessage: 'ArgoCD is not configured on the server' })
    }

    const params = new URLSearchParams({
        name,
        version,
        kind,
        resourceName: name,
        ...(namespace ? { namespace } : {}),
        ...(group ? { group } : {}),
    })

    const res = await fetch(
        `${base}/api/v1/applications/${encodeURIComponent(appName)}/resource?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${config.argocdToken}`,
                Accept: 'application/json',
            },
        }
    )

    if (!res.ok) {
        throw createError({ statusCode: res.status, statusMessage: 'Failed to fetch resource manifest' })
    }

    const data = await res.json()
    // `manifest` is a JSON string in ArgoCD's response — parse it so the
    // client gets a normal object instead of a stringified blob.
    let manifest = data?.manifest
    try {
        manifest = JSON.parse(manifest)
    } catch {
        // leave as-is if it wasn't valid JSON for some reason
    }

    return { manifest }
})
