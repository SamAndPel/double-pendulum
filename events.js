// Event handler code
// Set up and handle slider event listeners
slidergravity.oninput = function() {
    G = parseFloat(slidergravity.value);
    draw();
}

sliderdamping.oninput = function() {
    D = parseFloat(sliderdamping.value);
    draw();
}

sliderangleone.oninput = function() {
    p1theta = parseFloat(sliderangleone.value);
    draw();
}

sliderangletwo.oninput = function() {
    p2theta = parseFloat(sliderangletwo.value);
    draw();
}

sliderlengthone.oninput = function() {
    p1r = parseFloat(sliderlengthone.value);
    draw();
}

sliderlengthtwo.oninput = function() {
    p2r = parseFloat(sliderlengthtwo.value);
    draw();
}

slidermassone.oninput = function() {
    p1m = parseFloat(slidermassone.value);
    draw();
}

slidermasstwo.oninput = function() {
    p2m = parseFloat(slidermasstwo.value);
    draw();
}