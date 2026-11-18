document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(loginForm.action, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const contentType = response.headers.get("content-type");
                const data = contentType && contentType.includes("application/json")
                    ? await response.json()
                    : null;

                // Fejl fra RESTful backend (f.eks. 400, 401, 403, 500)
                if (!response.ok) {
                    alert(data?.error || data?.message || "Forkert brugernavn eller adgangskode.");
                    return;
                }

                // Succes (200/201) -> send videre til chats
                window.location.href = data?.redirectUrl || "/chats";
            } catch (err) {
                alert("Kunne ikke oprette forbindelse til serveren.");
            }
        });
    }
});