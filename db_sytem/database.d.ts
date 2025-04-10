type DBStoredObj = object

export function make_sub_db_object(obj: DBStoredObj, id: string): DBStoredObj
export function change_object_uuids(obj: DBStoredObj): DBStoredObj
export function stop_database_update(): void

export class DB_LOADER {
    constructor(save_func: (name: string, obj: object) => void, load_func: (name: string, default_object: object) => void): DB_LOADER
    save(name: string, obj: object): void
    load(name: string, default_object: object): void
}

export class DATABASE {
    object: DBStoredObj
    constructor(name: string, default_object: object, force: boolean, loader: DB_LOADER): DATABASE
    static get(name: string, default_object: object, constant: boolean): DBStoredObj
    static set(name: string, object: object, constant: boolean): void
    static delete_prop(root: object, prop: string): void
}