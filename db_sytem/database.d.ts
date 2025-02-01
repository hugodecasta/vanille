type DBStoredObj = object

export function make_sub_db_object(obj: DBStoredObj, id: string): DBStoredObj
export function change_object_uuids(obj: DBStoredObj): DBStoredObj
export function stop_database_update(): void

export class DATABASE {
    object: DBStoredObj
    constructor(name: string, default_object: object, force: boolean): DATABASE
    static get(name: string, default_object: object, constant: boolean): DBStoredObj
    static set(name: string, object: object, constant: boolean): void
    static delete_prop(root: object, prop: string): void
}