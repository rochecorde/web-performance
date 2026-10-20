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
const contactFormStatus = document.querySelector("#contact-form-status");

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    contactFormStatus.textContent = "Envoi de votre demande…";
    contactFormStatus.dataset.state = "sending";

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new URLSearchParams(new FormData(contactForm)),
        });
        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error(result.message || "Le serveur n’a pas pu accepter la demande.");
        }

        contactFormStatus.textContent = "Merci, votre demande a été transmise. Nous vous répondrons dès que possible.";
        contactFormStatus.dataset.state = "success";
        contactForm.reset();
    } catch (error) {
        console.error("Échec de l’envoi du formulaire PHP :", error);
        contactFormStatus.textContent = error instanceof Error
            ? error.message
            : "L’envoi a échoué. Réessayez ou écrivez-nous directement.";
        contactFormStatus.dataset.state = "error";
    } finally {
        submitButton.disabled = false;
    }
});
