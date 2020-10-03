// This is the main JS file for making the double pendulum work

function start() {
    trace = [];
    document.getElementById("sliders").style.display = "none";
    document.getElementById("startbtn").disabled = true;
    document.getElementById("stopbtn").disabled = false;
    runint = setInterval(run, 20);
    console.log("Started")
}

function stop() {
    clearInterval(runint);
    p1v = 0;
    p2v = 0;
    p1a = 0;
    p2a = 0;
    slidergravity.value = G;
    sliderdamping.value = D;
    sliderangleone.value = (p1theta % Math.PI);
    sliderangletwo.value = (p2theta % Math.PI);
    sliderlengthone.value = p1r;
    sliderlengthtwo.value = p2r;
    slidermassone.value = p1m;
    slidermasstwo.value = p2m;
    valuegravity.innerHTML = slidergravity.value + "g";
    valuedamping.innerHTML = "x" + sliderdamping.value;
    valueangleone.innerHTML = Math.round(sliderangleone.value * 100) / 100 + "rad";
    valueangletwo.innerHTML = Math.round(sliderangletwo.value * 100) / 100 + "rad";
    valuelengthone.innerHTML = sliderlengthone.value + "m"
    valuelengthtwo.innerHTML = sliderlengthtwo.value + "m"
    valuemassone.innerHTML = slidermassone.value + "kg";
    valuemasstwo.innerHTML = slidermasstwo.value + "kg";
    document.getElementById("sliders").style.display = "flex";
    document.getElementById("startbtn").disabled = false;
    document.getElementById("stopbtn").disabled = true;
    draw();
    console.log("Stopped")
}

function printlog() {
    const values = {};
    values.angle = {
        PendulumOne: p1theta,
        PendulumTwo: p2theta
    };
    values.length = {
        PendulumOne: p1r,
        PendulumTwo: p2r
    };
    values.mass = {
        PendulumOne: p1m,
        PendulumTwo: p2m
    };
    values.bobPosition = {
        PendulumOne: [x1, y1],
        PendulumTwo: [x2, y2]
    };
    values.velocity = {
        PendulumOne: p1v,
        PendulumTwo: p2v
    };
    values.acceleration = {
        PendulumOne: p1a,
        PendulumTwo: p2a
    };
    console.table(values);
    console.log("Gravity: " + G);
    console.log("Damping: " + D);
}

function run() {
    // Calculate changing accelerations (d^2y/dx^2 of theta)
    // Foromulae from https://www.myphysicslab.com/pendulum/double-pendulum-en.html
    const p1num1 = -G * ((2 * p1m) + p2m) * Math.sin(p1theta);
    const p1num2 = -p2m * G * Math.sin(p1theta - (2 * p2theta));
    const p1num3 = -2 * Math.sin(p1theta - p2theta) * p2m;
    const p1num4 = (p2v * p2v * p2r) + (p1v * p1v * p1r * Math.cos(p1theta - p2theta));
    const p1den = p1r * ((2 * p1m) + p2m - (p2m * Math.cos((2 * p1theta) - (2 * p2theta))));
    p1a = (p1num1 + p1num2 + (p1num3 * p1num4)) / p1den;

    const p2num1 = 2 * Math.sin(p1theta - p2theta);
    const p2num2 = p1v * p1v * p1r * (p1m + p2m);
    const p2num3 = G * (p1m + p2m) * Math.cos(p1theta);
    const p2num4 = p2v * p2v * p2r * p2m * Math.cos(p1theta - p2theta);
    const p2den = p1r * ((2 * p1m) + p2m - (p2m * Math.cos((2 * p1theta) - (2 * p2theta))));
    p2a = (p2num1 * (p2num2 + p2num3 + p2num4)) / p2den;

    // Update velocities from acceleration
    p1v += p1a;
    p2v += p2a;

    // Damp velocities
    p1v = p1v * D;
    p2v = p2v * D;

    // Update positions from velocities
    p1theta += p1v;
    p2theta += p2v;

    // Push x2, y2 onto trace
    trace.push({
        x: x2,
        y: y2
    });

    // Render
    draw();
}

function updateLabels() {
    // Update labels
    valuegravity.innerHTML = slidergravity.value + "g";
    valuedamping.innerHTML = "x" + sliderdamping.value;
    valueangleone.innerHTML = Math.round(sliderangleone.value * 100) / 100 + "rad";
    valueangletwo.innerHTML = Math.round(sliderangletwo.value * 100) / 100 + "rad";
    valuelengthone.innerHTML = sliderlengthone.value + "m"
    valuelengthtwo.innerHTML = sliderlengthtwo.value + "m"
    valuemassone.innerHTML = slidermassone.value + "kg";
    valuemasstwo.innerHTML = slidermasstwo.value + "kg";
}

function draw() {
    updateLabels();

    // Set up canvas transform
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Initialise transform
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "#071e3d";
    ctx.fillRect(0, 0, canv.width, canv.height); // Clear canvas
    ctx.translate(canv.width / 2, canv.height / 2); // Move to start pos
    ctx.rotate(Math.PI / 2); // Rotate so 0 is vertically down

    // Calculate bob positions
    x1 = p1r * Math.cos(p1theta);
    y1 = p1r * Math.sin(p1theta);

    x2 = x1 + (p2r * Math.cos(p2theta));
    y2 = y1 + (p2r * Math.sin(p2theta));


    // Draw trace
    ctx.beginPath();
    ctx.lineWidth = 2;
    for (let i = 0; i < trace.length - 1; i++) {
        ctx.moveTo(trace[i].x, trace[i].y);
        ctx.lineTo(trace[i + 1].x, trace[i + 1].y);
    }
    ctx.strokeStyle = traceGradient;
    ctx.stroke();

    // Draw line 1
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = "#21e6c1";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw line 2
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#21e6c1";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw bob 1
    ctx.beginPath();
    ctx.arc(x1, y1, p1m, 0, 2 * Math.PI);
    ctx.fillStyle = "#278ea5";
    ctx.fill();

    // Draw bob 2
    ctx.beginPath();
    ctx.arc(x2, y2, p2m, 0, 2 * Math.PI);
    ctx.fillStyle = "278ea";
    ctx.fill();
}

function buildGradient() {
    var gradient = ctx.createLinearGradient(0, 0, canv.width, 0);
    gradient.addColorStop("0", "#feff89");
    gradient.addColorStop("0.33", "#ff9f68");
    gradient.addColorStop("0.66", "#f85959");
    gradient.addColorStop("1", "#7c203a");
    return gradient;
}