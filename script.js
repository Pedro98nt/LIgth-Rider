"use strict";
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.xmlns = "http://www.w3.org/2000/svg";
        this.xlinkns = "http://www.w3.org/1999/xlink";
        this.select = function (e) { return document.querySelector(e); };
        this.selectAll = function (e) { return document.querySelectorAll(e); };
        this.mainTl = new TimelineMax();
        this.mainSVG = this.select('.mainSVG');
        this.ring = this.select('.ring');
        this.whole = this.select('.whole');
        this.dot = this.select('#dot');
        this.follower = this.select('#follower');
        this.particle = this.select('.particle');
        this.pContainer = this.select('#pContainer');
        this.particlePool = [];
        this.numParticles = 275;
        this.particleCount = 0;
        this.colorArray = ["#451A60", "#25245F", '#26247D', '#303894', '#1F45B9', '#2F5AA0', '#3276CD', '#3B94E6', '#41C2F4', '#50F7FE', '#7DFFFE', '#EABEFC', '#64A8AF'];
        this.createParticles = function () {
            var i = _this.numParticles, p;
            while (--i > -1) {
                p = _this.particle.cloneNode(true);
                _this.pContainer.appendChild(p);
                TweenMax.set(p, {
                    alpha: 0,
                    fill: _this.colorArray[i % _this.colorArray.length]
                });
                _this.particlePool.push(p);
                _this.completeParticle(p);
            }
        };
        this.playParticle = function () {
            var p = _this.particlePool[_this.particleCount];
            var curr = { x: _this.dot._gsTransform.x, y: _this.dot._gsTransform.y };
            var rad = Math.atan2(curr.y - 300, curr.x - 400);
            var deg = Math.round(rad * (180 / Math.PI));
            TweenMax.set(p, {
                x: _this.randomBetween(curr.x, curr.x - (strokeWidth / 10)),
                y: _this.randomBetween(curr.y, curr.y + (strokeWidth / 10)),
                alpha: 1,
                transformOrigin: '50% 50%'
            });
            var tl = new TimelineMax();
            tl.to(p, _this.randomBetween(3, 6), {
                physics2D: {
                    velocity: _this.randomBetween(5, 56),
                    angle: (deg % 2) ? deg : deg - 180,
                    gravity: _this.randomBetween(-3, 3)
                },
                onUpdate: _this.onUpdate,
                scale: _this.randomBetween(10, 33) / 10,
                onComplete: _this.completeParticle,
                onCompleteParams: [p],
                ease: Expo.easeInOut,
                alpha: 0
            });
            _this.particleCount++;
            _this.particleCount = (_this.particleCount >= _this.numParticles) ? 0 : _this.particleCount;
        };
        this.completeParticle = function (p) {
            TweenMax.set(p, {
                x: -10,
                y: -10,
                //alpha:1,
                scale: _this.randomBetween(5, 20) / 10
            });
        };
        this.randomBetween = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        var strokeWidth = 12;
        TweenMax.set(this.ring, {
            strokeWidth: strokeWidth,
            svgOrigin: '400 300'
        });
        TweenMax.set(this.whole, {
            svgOrigin: '400 300'
        });
        var tl = new TimelineMax({ repeat: -1, yoyo: false, onUpdate: this.playParticle, onUpdateScope: this });
        var orbitPath = MorphSVGPlugin.pathDataToBezier(this.ring, {
            offsetX: 0,
            offsetY: 0
        });
        tl.to(this.dot, 2.6, {
            bezier: {
                type: "cubic",
                values: orbitPath,
                autoRotate: false
            },
            ease: Linear.easeNone
        });
        this.createParticles();
    }
    return App;
}());
TweenMax.set('svg', {
    visibility: 'visible'
});
var app = new App();