export async function get_json(ep, op) {
    return await (await fetch(ep, op)).json()
}

export async function post_json(ep, json_data, op = {}) {
    return await (await fetch(ep, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data),
        ...op
    })).json()
}

export async function delete_endpoint(ep, op = {}) {
    return await (await fetch(ep, {
        method: 'delete',
        ...op
    })).json()
}


export function get_url_parameters() {
    const params = new URLSearchParams(window.location.search)
    const paramDict = {}
    for (const [key, value] of params.entries()) {
        paramDict[key] = value
    }
    return paramDict
}