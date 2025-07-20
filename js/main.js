"use strict";

// Spinner
var spinner = function () {
    setTimeout(function () {
        var spinnerElement = document.getElementById('spinner');
        if (spinnerElement) {
            spinnerElement.classList.remove('show');
        }
    }, 1);
};
spinner();

// Initiate the wowjs
new WOW().init();

// Facts counter
document.querySelectorAll('[data-toggle="counter-up"]').forEach(function(element) {
    counterUp(element, {
        delay: 10,
        time: 2000
    });
});

// Typed Initiate
if (document.querySelectorAll('.typed-text-output').length === 1) {
    var typed_strings = document.querySelector('.typed-text').textContent;
    var typed = new Typed('.typed-text-output', {
        strings: typed_strings.split(', '),
        typeSpeed: 100,
        backSpeed: 20,
        smartBackspace: false,
        loop: true
    });
}

// Smooth scrolling to section
document.querySelectorAll(".btn-scroll").forEach(function(button) {
    button.addEventListener('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var target = document.querySelector(this.hash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 0,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Skills
var skillWaypoint = new Waypoint({
    element: document.querySelector('.skill'),
    handler: function() {
        document.querySelectorAll('.progress .progress-bar').forEach(function(progressBar) {
            progressBar.style.width = progressBar.getAttribute('aria-valuenow') + '%';
        });
    },
    offset: '80%'
});

// Portfolio isotope and filter
var portfolioIsotope;
var portfolioContainer = document.querySelector('.portfolio-container');
if (portfolioContainer) {
    portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    document.querySelectorAll('#portfolio-flters li').forEach(function(filter) {
        filter.addEventListener('click', function() {
            document.querySelectorAll('#portfolio-flters li').forEach(function(item) {
                item.classList.remove('active');
            });
            this.classList.add('active');
            portfolioIsotope.arrange({filter: this.dataset.filter});
        });
    });
}

// Testimonials carousel
var testimonialCarousel = document.querySelector(".testimonial-carousel");
if (testimonialCarousel) {
    new OwlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1,
        element: testimonialCarousel
    });
}

// Back to top button
var backToTopButton = document.querySelector('.back-to-top');
if (backToTopButton) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            backToTopButton.style.display = 'block';
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transition = 'opacity 0.3s ease';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                if (window.pageYOffset <= 100) {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    });

    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return false;
    });
}