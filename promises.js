export async function wait_time(timer_ms) {
    return new Promise(ok => setTimeout(ok, timer_ms))
} 