let ticking = false;

window.addEventListener('scroll', function () {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            const scrollY = window.scrollY;
            const maxScroll = window.innerHeight * 1; // Ajusta según lo que necesites

            // Progreso de 0 a 1
            const progress = Math.min(scrollY / maxScroll, 1);

            // Desenfoque dinámico del fondo
            const bg = document.getElementById('background_blur');
            if (bg) {
                const blurAmount = progress * 10; // 0px a 10px de blur
                bg.style.filter = `blur(${blurAmount}px)`;

                const parallax = scrollY * -0.5; // Ajusta el factor
                bg.style.transform = `translateY(${parallax}px)`;
            }

            ticking = false;
        });

        ticking = true;
    }
});

const textarea = document.querySelector('textarea');

textarea.addEventListener('input', () => {
  textarea.style.height = 'auto'; // Resetea la altura
  textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta a su contenido
});



document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const flashMessage = document.getElementById("flash-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita la redirección

        const formData = new FormData(form);

        try {
            await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSc51GxTi8mcUA9tss2z-Wzbiguv3OovtSO7kUYg7LQzzuvK_A/formResponse", {
                method: "POST",
                body: formData,
                mode: "no-cors" // necesario porque Google Forms no devuelve CORS válido
            });

            // Mostrar mensaje de éxito
            showFlashMessage("✅ ¡Gracias! Tu mensaje ha sido enviado.");


            form.reset(); // limpia el formulario

        } catch (error) {
            showFlashMessage("❌ Hubo un error, inténtalo de nuevo.", "red");
            flashMessage.style.color = "red";
        }
    });
});
function showFlashMessage(message, color = "green") {
    const flashMessage = document.getElementById("flash-message");
    flashMessage.textContent = message;
    flashMessage.style.background = color === "green" ? "#28a745" : "#dc3545";
    flashMessage.classList.add("show");

    // Desaparece después de 3 segundos
    setTimeout(() => {
        flashMessage.classList.remove("show");
    }, 3000);
}