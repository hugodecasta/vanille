
export function check_for_sub_object(obj, loaded_sub_bases, databaseclass, is_contant = false) {
    const new_object = JSON.parse(JSON.stringify(obj))
    for (const attr in new_object) {
        const sub_elm = new_object[attr]
        if (typeof sub_elm != 'object' || sub_elm == null) continue
        const dbid = sub_elm['@@']
        if (dbid) {
            if (is_contant) {
                loaded_sub_bases[dbid] ??= new databaseclass(dbid, sub_elm)
            }
            else {
                databaseclass.set(dbid, sub_elm)
            }
            new_object[attr] = '@@::' + dbid
        }
        else {
            new_object[attr] = check_for_sub_object(sub_elm, loaded_sub_bases, databaseclass)
        }
    }
    return new_object
}

export async function resolve_sub_objects(obj, loaded_sub_bases, databaseclass, is_contant = false) {
    if (!obj) return obj
    for (const attr in obj) {
        const sub_elm = obj[attr]
        if (typeof sub_elm == 'object') obj[attr] = await resolve_sub_objects(sub_elm, loaded_sub_bases, databaseclass, is_contant)
        if (typeof sub_elm != 'string') continue
        if (sub_elm.includes('@@::')) {
            const dbid = sub_elm.replace('@@::', '')
            let data = null
            if (is_contant) {
                loaded_sub_bases[dbid] ??= new databaseclass(dbid, {})
                data = loaded_sub_bases[dbid].object
            }
            else {
                data = await databaseclass.get(dbid)

            }
            obj[attr] = data
        }
    }
    return obj
}

export function resolve_sub_objects_sync(obj, loaded_sub_bases, databaseclass, is_contant = false) {
    if (!obj) return obj
    for (const attr in obj) {
        const sub_elm = obj[attr]
        if (typeof sub_elm == 'object') obj[attr] = resolve_sub_objects_sync(sub_elm, loaded_sub_bases, databaseclass, is_contant)
        if (typeof sub_elm != 'string') continue
        if (sub_elm.includes('@@::')) {
            const dbid = sub_elm.replace('@@::', '')
            let data = null
            if (is_contant) {
                loaded_sub_bases[dbid] ??= new databaseclass(dbid, {})
                data = loaded_sub_bases[dbid].object
            }
            else {
                data = databaseclass.get(dbid)
            }
            obj[attr] = data
        }
    }
    return obj
}