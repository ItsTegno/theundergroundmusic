////////////////////
//     Scroll     //
////////////////////

const parallaxFactor = -0.5

window.addEventListener('scroll', function ()
{
    window.requestAnimationFrame(function ()
    {
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;

        ////////////////////////
        //     Background     //
        ////////////////////////

        const backgroundProgress = Math.min(scrollY / maxScroll, 1);

        const bg = document.getElementById('background');
        if (bg)
        {
            //Blur
            const blurAmount = backgroundProgress * 10; // 0px a 10px de blur
            bg.style.filter = `blur(${blurAmount}px)`;

            //Parallax
            const parallax = scrollY * parallaxFactor; // Ajusta el factor
            bg.style.transform = `translateY(${parallax}px)`;
        }

        ///////////////////
        //     Title     //
        ///////////////////

        const titleProgress = Math.min(scrollY / maxScroll * 2, 1);
        const inverseTitleProgress = lerp(1, 0, titleProgress);

        const title = document.getElementById('title');
        if (title)
        {
            const ancho = title.offsetWidth;

            if (window.innerWidth >= 768) {
                title.style.transform = `translateX(calc((50vw - ${ancho / 2}px) * ${ease(titleProgress)}))`;
                //title.style.paddingLeft = `calc(3vw * ${ease(inverseTitleProgress)})`;
            } else {
                title.style.transform = `translateX(0)`;
            }
        }
    });
});

function lerp(a, b, t)
{
    return a + (b - a) * t;
}

function ease(t)
{
    return (t * t) * (3 - 2 * t);
}

////////////////////////////////////
//     Adjust TextArea Height     //
////////////////////////////////////
const textArea = document.querySelector('textarea');
textArea.style.height = 'auto'; // Resetea la altura
textArea.style.height = textArea.scrollHeight + 'px';

textArea.addEventListener('input', () =>
{
  textArea.style.height = 'auto'; // Resetea la altura
  textArea.style.height = textArea.scrollHeight + 'px'; // Ajusta a su contenido
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