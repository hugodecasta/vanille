export function wait_time(timer_ms: number): Promise<void>
export function pending_promise(): [Function, Function, Promise<any>]
export function set_iter_inter(iterations, timer_per_iteration, func): number