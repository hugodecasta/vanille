import { br, button, div, h1, hr, listen_to } from "./components.js"
import { DATABASE } from "./db_sytem/database.js"

const main_div = div().add2b()
h1('Vanille').add2(main_div)

hr().add2b()

div().add2b().add('Ceci est un test de fonctionnement pour Vanille !')

hr().add2b()

function mon_composant_de_dingue() {

    const count_db = new DATABASE('vanille_test_counter', { count: 0 })

    let count = count_db.object.count

    const counter_shower = div()

    function update() {
        counter_shower.clear()
        counter_shower.innerHTML = 'Count = ' + count
        count_db.object.count = count
    }

    listen_to(() => count, update, true)

    const controler = div('',
        button('+', () => count += 1),
        button('reset', () => count = 0),
    )

    const comp = div().add(counter_shower, controler)
    return comp
}

const compteur = mon_composant_de_dingue()
compteur.add2b()