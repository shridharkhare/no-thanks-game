export const isPrivateChkBox = document.getElementById("private");
export const passwordInput = document.getElementById("create-room-password");

// Event listener for the private checkbox
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