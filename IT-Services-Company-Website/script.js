document.addEventListener('DOMContentLoaded', () => {
        // Initial loader timeout fallback
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
        }, 2000);
    

    // Loader
    window.addEventListener('load', () => {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
        }, 500);
    });

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    // Update the Intersection Observer to include all animated elements
    document.querySelectorAll('.service-card, .project-card, .section-title').forEach((el) => {
        observer.observe(el);
    });

    // 3D Rotation Effect
    document.addEventListener('mousemove', (e) => {
        const globe = document.querySelector('.globe');
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        globe.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});