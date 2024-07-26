export async function get_json(ep, op) {
    return await (await fetch(ep, op)).json()
}

export function get_url_parameters() {
    const params = new URLSearchParams(window.location.search)
    const paramDict = {}
    for (const [key, value] of params.entries()) {
        paramDict[key] = value
    }
    return paramDict
}