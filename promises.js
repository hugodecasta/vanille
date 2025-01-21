export async function wait_time(timer_ms) {
    return new Promise(ok => setTimeout(ok, timer_ms))
} 

export function pending_promise() {
    let ok = null
    let reject = null
    let prom = new Promise((o, r) => { ok = o; reject = r })
    return [ok, reject, prom]
}