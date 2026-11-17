const editBtn = document.querySelector('.editchat');
const nameInput = document.querySelector('.chatname');

editBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const chatid = editBtn.dataset.chatid;
    const chatname = nameInput.value.trim();

    if (!chatname) {
        alert("Navnet må ikke være tomt");
        return;
    }

    const response = await fetch(`/chats/${chatid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: chatname })
    });

    if (response.ok) {
        window.location.href = `/chats/${chatid}`;
    } else {
        alert("Kunne ikke redigere chatten");
    }
});