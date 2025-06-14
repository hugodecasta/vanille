import { alink, jsoncopy } from "./components.js"

const cached = {}

export async function get_json(ep, op) {
    if (cached[ep] && cached[ep].data) {
        return cached[ep].data
    }
    return await (await fetch(ep, op)).json()
}

export function set_cached_json(ep, op) {
    cached[ep] ??= {
        int: setInterval(async () => {
            cached[ep].data = await (await fetch(ep, op)).json()
        }, 5000)
    }
}

export async function get_text(ep, op) {
    return await (await fetch(ep, op)).text()
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

export function is_touch_device() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)
}

export function debounce_maker(func, wait = 1000) {
    let timeout
    return function (...args) {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(context, args), wait)
    }
}

export function debounce_force_maker(func, wait = 1000) {
    let timeout
    return function (...args) {
        if (timeout) return
        func(...args)
        timeout = setTimeout(() => timeout = null, wait)
    }
}

export function click_link(link, target, post_func = () => null) {
    const link_elm = alink(link, target, '')
    post_func(link_elm)
    link_elm.click()
}

export function download_file(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}