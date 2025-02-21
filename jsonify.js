export class JSONIFY {

    from_json(json_data) {
        throw Error('Not Implemented')
    }

    to_json() {
        throw Error('Not Implemented')
    }
}

export function resolve_json_default(default_json) {
    const resolved_json = {}
    console.log(default_json)
    for (const [prop, value] of Object.entries(default_json)) {
        let new_value = value
        if (Array.isArray(value)) {
            new_value = value[Math.floor(Math.random() * value.length)]
        }
        else if (typeof (value) == 'object' && value !== null) {
            new_value = resolve_json_default(value)
        }
        resolved_json[prop] = new_value
    }
    return resolved_json
}

export function json_set_by_path(root, path_str, value) {
    const path = path_str.split('.')
    let current = root
    console.log(path)
    for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) {
            current[path[i]] = {}
        }
        current = current[path[i]]
    }
    current[path[path.length - 1]] = value
    console.log(root)
}

export function json_path_exists(root, path_str) {
    const path = path_str.split('.')
    let current = root
    for (let i = 0; i < path.length; i++) {
        if (current[path[i]] === undefined) {
            return false
        }
        current = current[path[i]]
    }
    return true
}

export function json_get_value_by_path(root, path_str) {
    const path = path_str.split('.')
    let current = root
    for (let i = 0; i < path.length; i++) {
        if (current[path[i]] === undefined) {
            return undefined
        }
        current = current[path[i]]
    }
    return current
}