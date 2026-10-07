const siteNavigation = document.querySelector("#site-navigation");
const navigationToggle = document.querySelector(".site-nav-toggle");

document.body.classList.add("has-js");

if (siteNavigation && navigationToggle) {
    const closeNavigation = () => {
        siteNavigation.classList.remove("site-nav--open");
        navigationToggle.setAttribute("aria-expanded", "false");
        navigationToggle.setAttribute("aria-label", "Ouvrir le menu");
    };

    navigationToggle.addEventListener("click", () => {
        const isExpanded = navigationToggle.getAttribute("aria-expanded") === "true";

        siteNavigation.classList.toggle("site-nav--open", !isExpanded);
        navigationToggle.setAttribute("aria-expanded", String(!isExpanded));
        navigationToggle.setAttribute(
            "aria-label",
            isExpanded ? "Ouvrir le menu" : "Fermer le menu",
        );
    });

    siteNavigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            closeNavigation();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
            navigationToggle.focus();
        }
    });

    window.matchMedia("(min-width: 761px)").addEventListener("change", closeNavigation);
}

const contactForm = document.querySelector("#contact-form");

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();
    const emailDetails = new URLSearchParams({
        subject: `Demande de projet de ${name}`,
        body: `Nom : ${name}\nE-mail : ${email}\n\nProjet :\n${message}`,
    });

    window.location.href = `mailto:backerwebmaster@gmail.com?${emailDetails.toString()}`;
});
