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