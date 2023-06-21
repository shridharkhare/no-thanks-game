import { setInitialTheme } from "./theme.js";
import { isPrivateChkBox, passwordInput } from "./lobby/rooms.js";

setInitialTheme();

isPrivateChkBox.addEventListener("change", (event) => {
    const checked = event.target.checked;
    if (checked) {
        passwordInput.classList.remove("hidden");
        passwordInput.disabled = false;
    } else {
        passwordInput.classList.add("hidden");
        passwordInput.disabled = true;
    }
});