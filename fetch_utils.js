export async function get_json(ep, op) {
    return await (await fetch(ep, op)).json()
}