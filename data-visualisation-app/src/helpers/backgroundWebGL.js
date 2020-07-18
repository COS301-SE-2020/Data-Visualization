import React, { Component } from 'react';
import * as THREE from 'three';
// const OrbitControls = require('three-orbitcontrols');


var SEPARATION = 70, AMOUNTX = 50, AMOUNTY = 50;

var particles, count = 0;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var UPDATEX, UPDATEY, UPDATEZ;


class BackgroundDots extends Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.addCube = this.addCube.bind(this);
        this.initializeCamera = this.initializeCamera.bind(this);
        this.initializeOrbits = this.initializeOrbits.bind(this);

        this.canvasWidth = this.props.width + 'px';
        this.canvasHeight = this.props.height + 'px';
        console.log('width ' + this.canvasWidth + 'height ' + this.canvasHeight);
        console.log(props);
    }
    componentDidMount() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.props.width / this.props.height, 0.1, 1000);

        this.camera.position.z = 1001;
        this.camera.position.x = 205;
        this.camera.position.y = 183;

        //mouseX 205.3745771019061 mouseY 183.43114832911286 mouseZ 1001.7344446164304

        this.camera.lookAt( this.scene.position );

        var numParticles = AMOUNTX * AMOUNTY;

        var positions = new Float32Array( numParticles * 3 );
        var scales = new Float32Array( numParticles );

        var i = 0, j = 0;

        for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = 0; // y
                positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

                scales[ j ] = 1;

                i += 3;
                j ++;

            }

        }
//242424
        //0xd9d9d9

        // F8F9FB was 0xffffff
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

        var material = new THREE.ShaderMaterial( {

            uniforms: {
                color: { value: new THREE.Color( 0x242424 ) },
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent

        } );

        //

        this.particles = new THREE.Points( geometry, material );
        this.scene.add( this.particles );


        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer.setClearColor(0xF8F9FB, 1);

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );


        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.renderer.setSize(this.props.width, this.props.height);
        this.mount.appendChild(this.renderer.domElement);
        this.initializeOrbits();
        // this.initializeCamera();

        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // const material = new THREE.MeshBasicMaterial( { color: 0xFF00FF } );
        // this.cube = new THREE.Mesh( geometry, material );
        // this.scene.add( this.cube );
        this.animate();



        this.canvasWidth = this.props.width + 'px';
        this.canvasHeight = this.props.height + 'px';
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild(this.renderer.domElement);
    }
    initializeOrbits() {
        // this.controls.rotateSpeed = 1.0;
        // this.controls.zoomSpeed = 1.2;
        // this.controls.panSpeed = 0.8;
    }
    initializeCamera() {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 4;
    }
    animate() {


        this.frameId = window.requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);


        UPDATEX = this.camera.position.x;
        UPDATEY= this.camera.position.y;
        UPDATEZ= this.camera.position.z;

        var positions = this.particles.geometry.attributes.position.array;
        var scales = this.particles.geometry.attributes.scale.array;

        var i = 0, j = 0;

        for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                    ( Math.sin( ( iy + count ) * 0.5 ) * 50 );

                scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
                    ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;

                i += 3;
                j ++;

            }

        }

        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.scale.needsUpdate = true;

        // renderer.render( scene, camera );
        // this.renderer.render(this.scene, this.camera);

        count += 0.06;



    }
    addCube(cube) {
        this.scene.add(cube);
    }

    render() {

        return (
            <div>
                {/*<div*/}
                {/*    id="boardCanvas"*/}
                {/*    style={{ width: this.props.width + 'px', height: this.props.width + 'px' }}*/}
                {/*    ref={mount => {*/}
                {/*        this.mount = mount;*/}
                {/*    }}*/}
                {/*/>*/}
                <div
                    id="boardCanvas"
                    style={{ width: '1920px', height: '1080px',  }}
                    ref={mount => {
                        this.mount = mount;
                    }}
                />
            </div>
        );
    }
}

window.onkeypress = function(event) {
    if (event.key == '1') {
        console.log('mouseX ' + UPDATEX + ' mouseY ' + UPDATEY + ' mouseZ ' + UPDATEZ);
    }
};

export default BackgroundDots;