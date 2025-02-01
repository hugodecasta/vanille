export function get_json(ep: string, op: RequestInit): Promise<JSON>
export function set_cached_json(ep: string, op: RequestInit): void
export function get_text(ep: string, op: RequestInit): Promise<string>
export function post_json(ep: string, json_data: object, op: RequestInit): Promise<JSON>
export function delete_endpoint(ep: string, op: RequestInit): Promise<JSON>

export function get_url_parameters(): object

export function is_touch_device(): boolean
export function debounce_maker(func: Function, wait: number): void

export function click_link(link: string, target: string): void
export function download_file(filename: string, content: string): void