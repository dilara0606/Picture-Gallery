import './main.css'
import * as THREE from "three"
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

var scene;
var camera;
var renderer;
var params = {
    color: 0x00ff00
}

function createEnvironment(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.9, 0.9);
    const gui = new GUI();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({antialias: true, powerPerformance: "high-performance", physicallyCorrectLights: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Increase pixel ratio for sharper images
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Enable softer shadows

    document.getElementById("webgl").appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    addBoxWithTexture('floor', 250, 5, 250, 0, -2.5, 0, 'classicdark');

    // Add four walls with light pink color
    const wallColor = 0xFFC0CB;
    addBox('wall1', 250, 70, 5, 0, 22.5, -127.5, wallColor); // back wall
    addBox('wall2', 250, 70, 5, 0, 22.5, 127.5, wallColor);  // front wall
    addBox('wall3', 5, 70, 250, -127.5, 22.5, 0, wallColor); // left wall
    addBox('wall4', 5, 70, 250, 127.5, 22.5, 0, wallColor);  // right wall

    // Add the couch in the center of the room
    addCouch('couch', 30, 15, 15, 0, 7.5, 0, '4K-curtain_2');

    // Add vases with flowers to each corner
    addVaseWithFlowers('vase1', -120, 5, -120);
    addVaseWithFlowers('vase2', -120, 5, 120);
    addVaseWithFlowers('vase3', 120, 5, -120);
    addVaseWithFlowers('vase4', 120, 5, 120);

        // Add frames to each wall
    addFrame('frame1', 50, 25, 1, 55, 22.5, -125, 'frame_texture'); // Back wall
    addFrame('frame2', 50, 25, 1, 0, 22.5, -125, 'frame_texture');  // Back wall
    addFrame('frame3', 50, 25, 1, -55, 22.5, -125, 'frame_texture');  // Front wall

    addFrame('frame4', 50, 25, 0, 80, 130, 'frame_texture');   // Front wall
    addFrame('frame5', 50, 25,  0, 22.5, 127.5, 'frame_texture'); // Left wall
    addFrame('frame6', 50, 25,  0, 22.5, 127.5, 'frame_texture');  // Left wall

    addFrame('frame7', 50, 25, 127.5, 22.5, 0, 'frame_texture');  // Right wall
    addFrame('frame8', 50, 25, 127.5, 22.5, 0, 'frame_texture');   // Right wall
    addFrame('frame8', 50, 25, 127.5, 22.5, 0, 'frame_texture');   // Right wall

    addSpotLight("light1", 5, new THREE.Color(1, 1, 1), new THREE.Vector3(250, 250, 250));

    var ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
    scene.add(ambientLight);

    render();
}

function render(){
    renderer.render(scene, camera);
    requestAnimationFrame(function(){
        render();
    });
}

function addBox(name, w, h, d, x, y, z, color){
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: color});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
}

function addBoxWithTexture(name, w, h, d, x, y, z, texture){
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});

    var loader = new THREE.TextureLoader();
    material.map = loader.load('../textures/' + texture + '.jpg');
    material.normalMap = loader.load('../textures/' + texture + '_normal.jpg');
    material.roughnessMap = loader.load('../textures/' + texture + '_roughness.jpg');
    material.specularLevelMap = loader.load('../textures/' + texture + '_specularLevel.jpg');
    material.ambientMap = loader.load('../textures/' + texture + '_ambientocclusion.jpg');
    material.metallicMap = loader.load('../textures/' + texture + '_metallic.jpg');
    material.heightMap = loader.load('../textures/' + texture + '_height.jpg');
    material.basecolorMap = loader.load('../textures/' + texture + '_basecolor.jpg');
    material.displacementScale = 0;
    material.displacementBias = 0;

    var mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
}

function addSpotLight(name, intensity, color, pos) {
    var light = new THREE.SpotLight(color, intensity);

    light.name = name;

    light.position.set(pos.x, pos.y, pos.z);
    light.target.position.set(0, 0, 0);
    light.target.updateMatrixWorld();

    light.castShadow = true;

    light.distance = 2000;
    light.penumbra = 0.7;
    light.decay = 1;

    light.updateMatrixWorld();

    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;

    light.shadow.camera.near = 2;
    light.shadow.camera.far = 100;
    light.shadow.camera.fov = 50;

    scene.add(light);
}

function addVaseWithFlowers(name, x, y, z){
    // Larger Vase
    var vaseGeometry = new THREE.CylinderGeometry(10, 10, 40, 32);
    var vaseMaterial = new THREE.MeshStandardMaterial({color: 0x8B4513}); // Brown color for vase
    var vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.set(x, y, z);
    vase.castShadow = true;
    vase.receiveShadow = true;
    scene.add(vase);

    // Stems and Flowers
    for(let i = 0; i < 8; i++){
        // Green stem
        var stemGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
        var stemMaterial = new THREE.MeshStandardMaterial({color: 0x228B22}); // Green color for stem
        var stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(x + (Math.random() * 5 - 2.5), y + 20, z + (Math.random() * 5 - 2.5));
        stem.castShadow = true;
        stem.receiveShadow = true;
        scene.add(stem);

        // Flower head
        var flowerGeometry = new THREE.SphereGeometry(3, 32, 32); // Larger flower
        var flowerMaterial = new THREE.MeshStandardMaterial({color: 0xFF69B4}); // Pink color for flowers
        var flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(stem.position.x, stem.position.y + 10, stem.position.z); // Positioned at the top of the stem
        flower.castShadow = true;
        flower.receiveShadow = true;
        scene.add(flower);
    }
}

function addCouch(name, w, h, d, x, y, z, texture) {
    // Main body of the couch
    var bodyGeometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});
    
    var loader = new THREE.TextureLoader();
    material.normalMap = loader.load('../textures/' + texture + '_normal.jpg');
    material.roughnessMap = loader.load('../textures/' + texture + '_roughness.jpg');
    material.ambientMap = loader.load('../textures/' + texture + '_ambientocclusion.jpg');
    material.metallicMap = loader.load('../textures/' + texture + '_metallic.jpg');
    material.heightMap = loader.load('../textures/' + texture + '_height.jpg');
    material.basecolorMap = loader.load('../textures/' + texture + '_basecolor.jpg');
    material.displacementScale = 0;
    material.displacementBias = 0;
    
    var couchBody = new THREE.Mesh(bodyGeometry, material);
    couchBody.position.set(x, y + h / 4, z); // Adjusted Y position for lower body
    couchBody.castShadow = true;
    couchBody.receiveShadow = true;
    scene.add(couchBody);

    // Left front leg of the couch
    var legGeometry = new THREE.BoxGeometry(w / 10, h / 2, d / 10);
    var legMaterial = new THREE.MeshStandardMaterial({color: 0x333333}); // Dark color for the legs
    
    var leftFrontLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftFrontLeg.position.set(x - w / 2 + w / 10, y - h / 4, z - d / 2 + d / 10); // Lowered the position of the leg
    leftFrontLeg.castShadow = true;
    leftFrontLeg.receiveShadow = true;
    scene.add(leftFrontLeg);
    
    // Right front leg of the couch
    var rightFrontLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightFrontLeg.position.set(x + w / 2 - w / 10, y - h / 4, z - d / 2 + d / 10); // Lowered the position of the leg
    rightFrontLeg.castShadow = true;
    rightFrontLeg.receiveShadow = true;
    scene.add(rightFrontLeg);

    // Left back leg of the couch
    var leftBackLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftBackLeg.position.set(x - w / 2 + w / 10, y - h / 4, z + d / 2 - d / 10); // Lowered the position of the leg
    leftBackLeg.castShadow = true;
    leftBackLeg.receiveShadow = true;
    scene.add(leftBackLeg);

    // Right back leg of the couch
    var rightBackLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightBackLeg.position.set(x + w / 2 - w / 10, y - h / 4, z + d / 2 - d / 10); // Lowered the position of the leg
    rightBackLeg.castShadow = true;
    rightBackLeg.receiveShadow = true;
    scene.add(rightBackLeg);
}

function addFrame(name, w, h, d, x, y, z, texture) {
    // Çerçeve için ana gövde
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: 0x000000}); // Çerçeve rengi

    var loader = new THREE.TextureLoader();
    material.map = loader.load('../textures/' + texture + '.jpg'); // Resim için texture

    var frame = new THREE.Mesh(geometry, material);
    frame.name = name;
    frame.position.set(x, y, z);
    frame.castShadow = true;
    frame.receiveShadow = true;

    scene.add(frame);
}

createEnvironment();
