// server/api/github.ts

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.githubToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
        {
          viewer {
            pinnedItems(first: 6, types: [REPOSITORY]) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      `,
        }),
    })

    if (!res.ok) {
        throw createError({
            statusCode: res.status,
            statusMessage: 'Failed to fetch GitHub data',
        })
    }
    const data = await res.json()
    return data.data.viewer.pinnedItems.nodes
})
