# vanille
A Vanilla JS Utils

## How To use

The usable scripts are
 - **components.js** : vanilla JS component maker
 - **db_system/database.js** : localStorge auto manager

## Components.js

Contains function components to be use and executed in JS.

Common components such as div, span, button, etc. are implemented.

A function component returns an HTMLElement with decorative functions.

One can add the component to the body with `comp.add2b()` or to a specific element using `comp.add2(other_comp)`

## Database.js

...

## Example
```javascript
import { br, button, div, h1, hr, listen_to } from "./components.js"
import { DATABASE } from "./db_sytem/database.js"

const main_div = div() // creating a div
main_div.add2b() // adding ot to the body

h1('Vanille').add2(main_div) // creating a title adding it to the main div

hr().add2b()

// adding a content to a freshly created div
div()
    .add2b()
    .add('Ceci est un test de fonctionnement pour Vanille !')


hr().add2b()

// creating a custom component
function mon_composant_de_dingue() {

    // loading data from the database (localstorage)
    // with default value of { count:0 } (must be a JSON)
    const count_db = new DATABASE('vanille_test_counter', { count: 0 })

    let count = count_db.object.count

    const counter_shower = div()

    // creating an updater function for 
    function update() {
        counter_shower.clear() // clear the div content
        counter_shower.innerHTML = 'Count = ' + count

        count_db.object.count = count // maje sure the DB as the upd version
    }

    // listen to changes in thge "count" variable
    // executing the update function (true executes the fn on init)
    listen_to(() => count, update, true)

    // creating a control panel for the counter
    const controler = div('',
        button('+', () => count += 1),
        button('reset', () => count = 0),
    )

    // gathering all comps in one wrapper comp
    const comp = div().add(counter_shower, controler)
    return comp
}

// instenciating the counter and adding it to the body
const compteur = mon_composant_de_dingue()
compteur.add2b()

```