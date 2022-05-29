"use strict";
function* CircleGenerator(pos) {
    // Start with:
    // Position = Center Position
    const [cx, cy] = pos;
    let [x, y] = [cx, cy];
    // Radius = Max Radius
    let radius = 48;
    // Left Angle = 180
    let leftAngle = 180;
    // Right Angle = 0
    let rightAngle = 0;
    const rand = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    while (true) {
        // PICK TWO ANGLES: Left and Right
        // Left should be between 155 and 205 degrees
        leftAngle = rand(155, 205);
        // Right should be between -35 and 35 degrees
        rightAngle = rand(-25, 25);
        // get next set of circle centers by:
        // Generating a new, smaller radius for each angle
        let nextRadius = radius * 0.8;
        // calculate the distance from current center by adding current radius to this circles radius
        const distanceToNextCenter = radius + nextRadius;
        // use cos & sin to get next point
        const rightPoint = [
            Math.cos(rightAngle * (Math.PI / 180)) * distanceToNextCenter,
            Math.sin(rightAngle * (Math.PI / 180)) * distanceToNextCenter
        ];
        const leftPoint = [
            Math.cos(leftAngle * (Math.PI / 180)) * distanceToNextCenter,
            Math.sin(leftAngle * (Math.PI / 180)) * distanceToNextCenter
        ];
        yield {
            left: {
                cx: leftPoint[0],
                cy: leftPoint[1],
                r: nextRadius
            },
            right: {
                cx: rightPoint[0],
                cy: rightPoint[1],
                r: nextRadius
            }
        };
        radius = nextRadius;
    }
}
window.addEventListener("load", onLoad);
function createTestCanvas(parent) {
    const canvas = document.createElement("canvas");
    canvas.width = 460;
    canvas.height = 460 / 1.62;
    parent.appendChild(canvas);
    return canvas.getContext("2d");
}
function createCloud() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 400 164");
    svg.style.top = Math.random() * 40 + "%";
    const baseCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    baseCircle.setAttribute("cx", "200");
    baseCircle.setAttribute("cy", "82");
    baseCircle.setAttribute("r", "40");
    baseCircle.setAttribute("fill", "white");
    svg.appendChild(baseCircle);
    const gen = CircleGenerator([400, 164]);
    let current = gen.next();
    for (let i = 0; i < 64; i += 1) {
        const { left, right } = current.value;
        const { cx: lx, cy: ly, r: lr } = left;
        const { cx: rx, cy: ry, r: rr } = right;
        const leftCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const rightCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        leftCircle.setAttribute("cx", lx + 200);
        leftCircle.setAttribute("cy", ly + 82);
        leftCircle.setAttribute("r", lr);
        leftCircle.setAttribute("fill", "white");
        rightCircle.setAttribute("cx", rx + 200);
        rightCircle.setAttribute("cy", ry + 82);
        rightCircle.setAttribute("r", rr);
        rightCircle.setAttribute("fill", "white");
        svg.style.filter = `blur(6px)`;
        svg.appendChild(leftCircle);
        svg.appendChild(rightCircle);
        current = gen.next();
    }
    return svg;
}
function onLoad() {
    const root = document.getElementById("root") || document.body;
    const ctx = createTestCanvas(root);
    let i = 0;
    root.appendChild(createCloud());
    const interval = window.setInterval(() => {
        if (i < 6)
            root.appendChild(createCloud());
        else
            window.clearInterval(interval);
        i += 1;
    }, 2100);
}