import { check_for_sub_object, resolve_sub_objects, resolve_sub_objects_sync } from "./common.js"

function create_uuid() {
    return (self.crypto.randomUUID?.() ?? Math.random() + '-' + Math.random())
}

const loaded_sub_bases = {}
export function make_sub_db_object(obj, id = null) {
    obj['@@'] ??= id ?? create_uuid()
    loaded_sub_bases[obj['@@']] = new DATABASE(obj['@@'], obj)
    return loaded_sub_bases[obj['@@']].object
}

export function change_object_uuids(obj) {
    if (obj['@@']) {
        obj['@@_old'] = obj['@@']
        obj['@@'] = create_uuid()
    }
    for (const attr in obj) {
        if (typeof obj[attr] == 'object' && obj != null) {
            change_object_uuids(obj[attr])
        }
    }
    return obj
}

export function stop_database_update() {
    stop_saving = true
}

let stop_saving = false
// window.stop_database_update = stop_database_update

export class DATABASE {

    object = undefined
    int = undefined

    before_save = undefined

    constructor(name, default_object, force = false, loader = localstorage_loader) {

        this.object = DATABASE.get(name, default_object, true, loader)
        this.name = name
        this.loader = loader

        if (force) this.object = default_object

        this.before_save = []
        this.int = setInterval(() => {
            if (stop_saving) return clearInterval(this.int)
            this.save()

        }, 500)

        this.onload(this.object)

    }

    save() {
        this.before_save.forEach(f => f(this.object))
        DATABASE.set(this.name, this.object, true, this.loader)
    }

    onload(object) {
        return null
    }

    add_before_save(func) {
        this.before_save.push(func)
    }

    stop() {
        clearInterval(this.int)
    }

}

DATABASE.get = function (name, default_object, constant = false, loader = localstorage_loader) {
    const object = loader.load(name, default_object)
    return resolve_sub_objects_sync(object, loaded_sub_bases, DATABASE, constant)

}

DATABASE.set = function (name, object, constant = false, loader = localstorage_loader) {
    const saved_object = check_for_sub_object(object, loaded_sub_bases, DATABASE, constant)
    loader.save(name, saved_object)
}

DATABASE.delete_prop = function (root, prop) {
    if (!root[prop]) return
    if (root[prop]['@@']) {
        if (loaded_sub_bases[root[prop]['@@']]) {
            loaded_sub_bases[root[prop]['@@']].stop()
            delete loaded_sub_bases[root[prop]['@@']]
        }
        localStorage.removeItem(root[prop]['@@'])
    }
    if (typeof root[prop] == 'object' && root[prop] != null) {
        for (const attr in root[prop]) DATABASE.delete_prop(root[prop], attr)
    }
    delete root[prop]
}

export class DB_LOADER {
    constructor(save_func, load_func) {
        this.save_func = save_func
        this.load_func = load_func
    }
    save(name, obj) {
        this.save_func(name, obj)
    }
    load(name) {
        return this.load_func(name)
    }
}

const localstorage_loader = new DB_LOADER(
    (name, obj) => {
        localStorage.setItem(name, JSON.stringify(obj))
    },
    (name, default_object) => {
        return JSON.parse(localStorage.getItem(name)) ?? default_object
    }
)