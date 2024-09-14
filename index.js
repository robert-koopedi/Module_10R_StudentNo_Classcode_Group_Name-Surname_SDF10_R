import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://mobile-app-2f3db-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(itemID, itemValue) {
    const listItem = document.createElement("li");
    listItem.textContent = itemValue;

    listItem.addEventListener("click", () => {
        if (confirm("Are you sure you want to remove this item?")) {
        remove(ref(database, `shoppingList/${itemID}`))
            .then(() => console.log("Item removed:", itemID))
            .catch(error => console.error("Error removing item:", error));
        }
});

    shoppingListEl.appendChild(listItem);
}

onValue(shoppingListInDB, snapshot => {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        clearShoppingListEl();
        itemsArray.forEach(([itemID, itemValue]) => appendItemToShoppingListEl(itemID, itemValue));
    } else {
        shoppingListEl.innerHTML = "No items here... yet";
    }
}, error => console.error("Error fetching data:", error));

addButtonEl.addEventListener("click", () => {
    let inputValue = inputFieldEl.value.trim();

    if (inputValue === "") {
        console.log("Please enter a valid item.");
        return;
    }

    push(shoppingListInDB, inputValue)
        .then(() => {
            clearInputFieldEl();
            console.log("Item added:", inputValue);
        })
        .catch(error => console.error("Error adding item:", error));
});
