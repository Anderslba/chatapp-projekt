const deleteBtns = document.querySelectorAll('.deletechat');

deleteBtns.forEach(btn => {
    btn.addEventListener('click', async (event) => {
        event.stopPropagation();

        const id = btn.dataset.chatid;

        if (confirm("Er du sikker på, at du vil slette denne chat?")) {
            const result = await fetch(`/chats/${id}`, {
                method: "DELETE",
            });

            if (result.ok) {
                window.location.href = "/chats";
            } else {
                alert("Kunne ikke slette chatten");
            }
        }
    });
});