"use strict";

/* =========================================================
   BARBEARIA SR. HILÁRIO
   JAVASCRIPT
========================================================= */


/* ================= MENU ================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        const aberto = mobileMenu.classList.toggle("open");

        menuButton.classList.toggle("active", aberto);

        menuButton.setAttribute(
            "aria-expanded",
            aberto ? "true" : "false"
        );

        document.body.style.overflow =
            aberto ? "hidden" : "";
    });


    /* Fechar menu ao clicar em um link */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");

            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.style.overflow = "";
        });

    });

}


/* ================= SCROLL SUAVE ================= */

const internalLinks =
    document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        const destino =
            document.querySelector(this.getAttribute("href"));

        if (!destino) return;

        event.preventDefault();

        destino.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* ================= GALERIA ================= */

const slides =
    document.querySelectorAll(".gallery-slide");

const prevButton =
    document.getElementById("galleryPrev");

const nextButton =
    document.getElementById("galleryNext");

const dots =
    document.querySelectorAll(".gallery-dot");

const currentSlide =
    document.getElementById("currentSlide");

let slideAtual = 0;

let intervaloGaleria;


/* Mostrar slide */

function mostrarSlide(numero) {

    if (!slides.length) return;

    slideAtual = numero;

    slides.forEach((slide, index) => {

        slide.classList.toggle(
            "active",
            index === slideAtual
        );

    });


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === slideAtual
        );

    });


    if (currentSlide) {

        currentSlide.textContent =
            String(slideAtual + 1).padStart(2, "0");

    }

}


/* Próxima foto */

function proximoSlide() {

    if (!slides.length) return;

    const proximo =
        (slideAtual + 1) % slides.length;

    mostrarSlide(proximo);

}


/* Foto anterior */

function slideAnterior() {

    if (!slides.length) return;

    const anterior =
        (slideAtual - 1 + slides.length)
        % slides.length;

    mostrarSlide(anterior);

}


/* Botão próximo */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            proximoSlide();

            reiniciarAutoplay();

        }
    );

}


/* Botão anterior */

if (prevButton) {

    prevButton.addEventListener(
        "click",
        () => {

            slideAnterior();

            reiniciarAutoplay();

        }
    );

}


/* Bolinhas */

dots.forEach(dot => {

    dot.addEventListener("click", () => {

        const numero =
            Number(dot.dataset.slide);

        mostrarSlide(numero);

        reiniciarAutoplay();

    });

});


/* ================= AUTOPLAY ================= */

function iniciarAutoplay() {

    if (slides.length <= 1) return;

    intervaloGaleria =
        setInterval(
            proximoSlide,
            5000
        );

}


function pararAutoplay() {

    clearInterval(intervaloGaleria);

}


function reiniciarAutoplay() {

    pararAutoplay();

    iniciarAutoplay();

}


/* Pausar quando o mouse estiver sobre a galeria */

const gallery =
    document.querySelector(".gallery");

if (gallery) {

    gallery.addEventListener(
        "mouseenter",
        pararAutoplay
    );

    gallery.addEventListener(
        "mouseleave",
        iniciarAutoplay
    );

}


/* ================= SWIPE CELULAR ================= */

let toqueInicialX = 0;
let toqueFinalX = 0;

if (gallery) {

    gallery.addEventListener(
        "touchstart",
        event => {

            toqueInicialX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    gallery.addEventListener(
        "touchend",
        event => {

            toqueFinalX =
                event.changedTouches[0].screenX;

            const distancia =
                toqueFinalX - toqueInicialX;

            if (Math.abs(distancia) < 50) {
                return;
            }

            if (distancia < 0) {

                proximoSlide();

            } else {

                slideAnterior();

            }

            reiniciarAutoplay();

        },
        { passive: true }
    );

}


/* ================= TECLADO ================= */

document.addEventListener(
    "keydown",
    event => {

        if (!slides.length) return;

        if (event.key === "ArrowRight") {

            proximoSlide();

            reiniciarAutoplay();

        }

        if (event.key === "ArrowLeft") {

            slideAnterior();

            reiniciarAutoplay();

        }

        if (event.key === "Escape") {

            if (
                mobileMenu &&
                mobileMenu.classList.contains("open")
            ) {

                mobileMenu.classList.remove("open");

                if (menuButton) {

                    menuButton.classList.remove("active");

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

                document.body.style.overflow = "";

            }

        }

    }
);


/* ================= CARREGAR FOTOS ================= */

/*
   Quando você colocar as imagens dentro da pasta:

   fotos/barbearia-01.jpg
   fotos/barbearia-02.jpg
   fotos/barbearia-03.jpg
   fotos/barbearia-04.jpg
   fotos/barbearia-05.jpg

   o JavaScript transforma os espaços
   automaticamente em fotos.
*/

function carregarFotos() {

    slides.forEach((slide, index) => {

        const numero =
            String(index + 1).padStart(2, "0");

        const caminho =
            `fotos/barbearia-${numero}.jpg`;

        const imagem =
            new Image();

        imagem.src = caminho;

        imagem.alt =
            `Foto da Barbearia Sr. Hilário ${index + 1}`;

        imagem.onload = () => {

            slide.innerHTML = "";

            slide.appendChild(imagem);

        };

    });

}


/* ================= ANIMAÇÕES DE ENTRADA ================= */

const elementosReveal =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            entradas => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entrada.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elementosReveal.forEach(elemento => {

        observer.observe(elemento);

    });

} else {

    elementosReveal.forEach(elemento => {

        elemento.classList.add("visible");

    });

}


/* ================= ANO DO RODAPÉ ================= */

const year =
    document.getElementById("year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* ================= INICIALIZAÇÃO ================= */

mostrarSlide(0);

carregarFotos();

iniciarAutoplay();


/* =========================================================
   FIM
========================================================= */