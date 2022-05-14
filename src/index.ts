import './style.css';
import * as d3 from 'd3';
import { JavascriptModulesPlugin } from 'webpack';

const component = () => {
    const element = document.createElement('div');
    element.innerHTML = 'Hello World';
    element.classList.add('hello');
    return element;
};
document.body.appendChild(component());

const data: any[] = [];
d3.range(5000).forEach(function (el) {
    data.push({ value: el });
});

const width = 750,
    height = 500;
const groupSpacing = 4;
const cellSpacing = 2;
const offsetTop = height / 5;
const cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;

const canvas = d3.select('#container').append('canvas').attr('width', width).attr('height', height);

var context = canvas.node().getContext('2d');

const customBase = document.createElement('custom');

const custom = d3.select(customBase);

const databind = (data: any[]) => {
    const colorScale = d3.scaleSequential(d3.interpolateSpectral).domain(
        d3.extent(data, function (d) {
            return d;
        }),
    );
    const join = custom.selectAll('custom.rect').data(data);
    const enterSel = join
        .enter()
        .append('custom')
        .attr('class', 'rect')
        .attr('x', function (d: any, i: number) {
            const x0 = Math.floor(i / 100) % 10,
                x1 = Math.floor(i % 10);
            return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
        })
        .attr('y', function (d: any, i: number) {
            const y0 = Math.floor(i / 1000),
                y1 = Math.floor((i % 100) / 10);
            return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
        })
        .attr('width', 0)
        .attr('height', 0);

    join.merge(enterSel)
        .transition()
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fillStyle', function (d: any) {
            return colorScale(d);
        });
    const exitSel = join.exit().transition().attr('width', 0).attr('height', 0).remove();
};

const draw = () => {
    context.clearRect(0, 0, width, height);
    const elements = custom.selectAll('custom.rect');
    elements.each(function (d, i) {
        const node = d3.select(this);
        context.fillRect(
            parseFloat(node.attr('x')),
            parseFloat(node.attr('y')),
            parseFloat(node.attr('width')),
            parseFloat(node.attr('height')),
        );
    });
};

databind(data);
const t = d3.timer(function (elapsed) {
    draw();
    if (elapsed > 300) {
        t.stop();
    }
});
