const deleteBtns = document.querySelectorAll('.deleteuser');

deleteBtns.forEach(btn => {
    btn.addEventListener('click', async (event) => {
        event.preventDefault();
        const id = btn.dataset.userid;
        if (confirm("Er du sikker på, at du vil slette denne bruger?")) {
            const result = await fetch(`/users/${id}`, {
                method: "DELETE",
            })
 
            if (result.ok) {
                window.location.href="/users"
            } else {
                alert("Kunne ikke slette brugeren");
            }
        }
    });
});