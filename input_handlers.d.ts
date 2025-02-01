import { EventHandler } from "./components"

export class KEYSTATE extends EventHandler {
    DEBUG: boolean
    confront(key_code: string): boolean
    confront_one_time(key_code: string): boolean
    on_key_code(key_code: string, func: Function): void
}

export const main_key_state: KEYSTATE

enum axes_name_dir {
    'LAxeX', 'LAxeY',
    'RAxeX', 'RAxeY',
}

enum axes_name {
    'LAxeX',
    'RAxeX',
}

class PADSTATE extends EventHandler {
    set_axe_threashold(name: axes_name_dir, threashold: number): void
    set_full_axe_threashold(axe_name: axes_name, threashold: number): void
    set_axes_threashold(threashold: number): void
    value(key: string): boolean | number
}

export const main_pad_state: PADSTATE