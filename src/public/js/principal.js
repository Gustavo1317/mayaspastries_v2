let lastScrollTop = 0;
const navbar = document.getElementById("nav-container");
const navbarHeight = 80;
window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    navbar.style.top = "0px";
  } else if (scrollTop > lastScrollTop) {
    navbar.style.top = `-${navbarHeight}px`; 
  } else {
    navbar.style.top = "0px";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
const whatsappButton = document.querySelector(".whatsapp-button a");
const whatsappMessage = document.querySelector("#whatsapp-message");

whatsappButton.addEventListener("mouseenter", function () {
  whatsappMessage.textContent = "WhatsApp";
});

whatsappButton.addEventListener("mouseleave", function () {
  whatsappMessage.textContent = "Hola, ¿en qué podemos ayudarte?";
});
