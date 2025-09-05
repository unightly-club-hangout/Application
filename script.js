document.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.body.style.setProperty('background-position-x', x * 100 + '%');
    document.body.style.setProperty('background-position-y', y * 100 + '%');
});