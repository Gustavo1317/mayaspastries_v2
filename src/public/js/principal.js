let lastScrollTop = 0;
const navbar = document.getElementById("nav-container");

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    // Si el scroll está en la parte superior de la página
    navbar.style.top = "0px";
  } else if (scrollTop > lastScrollTop) {
    navbar.style.top = "-100px";
  } else {
    navbar.style.top = "0px";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Para Safari
});

const whatsappButton = document.querySelector(".whatsapp-button a");
const whatsappMessage = document.querySelector("#whatsapp-message");

whatsappButton.addEventListener("mouseenter", function () {
  whatsappMessage.textContent = "WhatsApp";
});

whatsappButton.addEventListener("mouseleave", function () {
  whatsappMessage.textContent = "Hola, ¿en qué podemos ayudarte?";
});
