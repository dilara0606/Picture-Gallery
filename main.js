import './main.css'
import * as THREE from "three"
import gsap from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from 'dat.gui';

var scene;
var camera;
var renderer;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var params = {
    color: 0x00ff00
}

function createEnvironment(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

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
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.update();

    addFloor('floor', 250, 5, 250, 0, -2.5, 0, 'classicdark');
    // addFloor('floor', 250, 5, 250, 0, 80, 0, 'classicdark');

    const wallTexture = "concrete_wall_001";
    const vaseTexture = "fabric_96";
    const coachTexture = "4K-curtain_2";

    addWall('wall1', 250, 70, 5, 0, 22.5, -127.5, wallTexture); // back wall
    addWall('wall2', 250, 70, 5, 0, 22.5, 127.5, wallTexture);  // front wall
    addWall('wall3', 5, 70, 250, -127.5, 22.5, 0, wallTexture); // left wall
    addWall('wall4', 5, 70, 250, 127.5, 22.5, 0, wallTexture);  // right wall

    addCouch('couch1', 60, 10, 15, 0, 5, -50, coachTexture);
    addCouch('couch2', 60, 10, 15, 0, 5, 50, coachTexture);
    addCouch('couch3', 15, 10, 60, -50, 5, 0, coachTexture);
    addCouch('couch4', 15, 10, 60, 50, 5, 0, coachTexture);

    addVaseWithFlowers('vase1', -110, 5, -110, vaseTexture);
    addVaseWithFlowers('vase2', -110, 5, 110, vaseTexture);
    addVaseWithFlowers('vase3', 110, 5, -110, vaseTexture);
    addVaseWithFlowers('vase4', 110, 5, 110, vaseTexture);

    addSpot('spot1', 55, 42.5, -125);
    addSpot('spot2', 0, 42.5, -125);
    addSpot('spot3', -55, 42.5, -125);

    addPointLight(55, 42.5, -123, new THREE.Color(1, 1, 1));
    addPointLight(0, 42.5, -123, new THREE.Color(1, 1, 1));
    addPointLight(-55, 42.5, -123, new THREE.Color(1, 1, 1));

    addSpot('spot4', 55, 42.5, 125);
    addSpot('spot5', 0, 42.5, 125);
    addSpot('spot6', -55, 42.5, 125);

    addPointLight(55, 42.5, 123, new THREE.Color(1, 1, 1));
    addPointLight(0, 42.5, 123, new THREE.Color(1, 1, 1));
    addPointLight(-55, 42.5, 123, new THREE.Color(1, 1, 1));

    addSpot('spot7', -125, 42.5, 55);
    addSpot('spot8', -125, 42.5, 0);
    addSpot('vase9', -125, 42.5, -55);

    addPointLight(-123, 42.5, 55, new THREE.Color(1, 1, 1));
    addPointLight(-123, 42.5, 0, new THREE.Color(1, 1, 1));
    addPointLight(-123, 42.5, -55, new THREE.Color(1, 1, 1));

    addSpot('spot10', 125, 42.5, 55);
    addSpot('spot11', 125, 42.5, 0);
    addSpot('spot12', 125, 42.5, -55);

    addPointLight(123, 42.5, 55, new THREE.Color(1, 1, 1));
    addPointLight(123, 42.5, 0, new THREE.Color(1, 1, 1));
    addPointLight(123, 42.5, -55, new THREE.Color(1, 1, 1));

    addFrame('frame1', 50, 25, 1, 55, 22.5, -125, "frame1");
    addFrame('frame2', 50, 25, 1, 0, 22.5, -125, "frame2"); 
    addFrame('frame3', 50, 25, 1, -55, 22.5, -125, "frame3");  

    addFrame('frame4', 50, 25, 1, 55, 22.5, 125, "frame4");   
    addFrame('frame5', 50, 25, 1, 0, 22.5, 125, "frame5"); 
    addFrame('frame6', 50, 25, 1, -55, 22.5, 125, "frame6"); 

    addFrame('frame7', 1, 25, 50, -125, 22.5, 55, "frame7"); 
    addFrame('frame8', 1, 25, 50, -125, 22.5, 0, "frame8");   
    addFrame('frame9', 1, 25, 50, -125, 22.5, -55, "frame9");  

    addFrame('frame10', 1, 25, 50, 125, 22.5, 55, "frame10");  
    addFrame('frame11', 1, 25, 50, 125, 22.5, 0, "frame11");   
    addFrame('frame12', 1, 25, 50, 125, 22.5, -55, "frame12");

    // var ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
    // scene.add(ambientLight);

    render();
}

function render(){
    renderer.render(scene, camera);
    requestAnimationFrame(function(){
        render();
    });
}

function addWall(name, w, h, d, x, y, z, texture){
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});

    var loader = new THREE.TextureLoader();
    material.map = loader.load('../textures/wallpaper/' + texture + '_disp_4k.jpg');
    material.normalDXMap = loader.load('../textures/wallpaper/' + texture + '_nor_dx_4k.jpg');
    material.roughnessMap = loader.load('../textures/wallpaper/' + texture + '_rough_4k.jpg');
    material.normalGLMap = loader.load('../textures/wallpaper/' + texture + '_nor_gl_4k.jpg');
    material.diffMap = loader.load('../textures/wallpaper/' + texture + '_diff_4k.jpg');
    material.aoMap = loader.load('../textures/wallpaper/' + texture + '_ao_4k.jpg');
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

function addFloor(name, w, h, d, x, y, z, texture){
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});

    var loader = new THREE.TextureLoader();
    material.map = loader.load('../textures/floor/' + texture + '.jpg');
    material.normalMap = loader.load('../textures/floor/' + texture + '_normal.jpg');
    material.roughnessMap = loader.load('../textures/floor/' + texture + '_roughness.jpg');
    material.specularLevelMap = loader.load('../textures/floor/' + texture + '_specularLevel.jpg');
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

function addPointLight (x, y, z, helperColor){
    const color = 0xffffff;
    const intensity = 15;
    const distance = 5000;
    const decay = 1;
  
    const pointLight = new THREE.PointLight(color, intensity, distance, decay);
    pointLight.position.set(x, y, z);
  
    scene.add(pointLight);
  
    // const pointLightHelper = new THREE.PointLightHelper(
    //   pointLight,
    //   10,
    //   helperColor
    // );
    // scene.add(pointLightHelper);
  };

function addVaseWithFlowers(name, x, y, z, texture){

    var vaseGeometry = new THREE.CylinderGeometry(8, 8, 30, 20);
    var vaseMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});

    var loader = new THREE.TextureLoader();
    vaseMaterial.normalMap = loader.load('../textures/vase/' + texture + '_normal-4K.jpg');
    vaseMaterial.roughnessMap = loader.load('../textures/vase/' + texture + '_roughness-4K.jpg');
    vaseMaterial.ambientocclusionMap = loader.load('../textures/vase/' + texture + '_ambientocclusion-4K.jpg');
    vaseMaterial.map = loader.load('../textures/vase/' + texture + '_basecolor-4K.jpg');
    vaseMaterial.opacityMap = loader.load('../textures/vase/' + texture + '_opacity-4K.jpg');
    vaseMaterial.metallicMap = loader.load('../textures/vase/' + texture + '_metallic-4K.jpg');
    vaseMaterial.heightMap = loader.load('../textures/vase/' + texture + '_height-4K.jpg');
    vaseMaterial.displacementScale = 0;
    vaseMaterial.displacementBias = 0;

    var vase = new THREE.Mesh(vaseGeometry, vaseMaterial);

    vase.position.set(x, y, z);
    vase.castShadow = true;
    vase.receiveShadow = true;
    scene.add(vase);

    // Ağacı saksının içerisine yerleştirme
    function addTree(x, y, z) {
        // Gövde oluşturma
        var trunkGeometry = new THREE.CylinderGeometry(2, 4, 20, 16);
        var trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Kahverengi gövde
        var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

        // Gövdenin pozisyonu, saksının üst kısmına göre ayarlanıyor
        trunk.position.set(x, y + 25, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        scene.add(trunk);

        // Yapraklar için küre oluşturma
        for (let i = 0; i < 3; i++) {
            var leafGeometry = new THREE.SphereGeometry(7 - i * 2, 32, 32); // Yaprakların çapı yukarıya doğru azalıyor
            var leafMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Yeşil yapraklar
            var leaf = new THREE.Mesh(leafGeometry, leafMaterial);

            leaf.position.set(x, y + 35 + i * 5, z); // Yapraklar gövdenin üst kısmına yerleştiriliyor
            leaf.castShadow = true;
            leaf.receiveShadow = true;
            scene.add(leaf);
        }
    }

    // Ağacı saksının içine ekliyoruz
    addTree(x, y, z);
}

function addCouch(name, w, h, d, x, y, z, texture) {

    var bodyGeometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});
    
    var loader = new THREE.TextureLoader();
    material.normalMap = loader.load('../textures/couch/' + texture + '_normal.jpg');
    material.roughnessMap = loader.load('../textures/couch/' + texture + '_roughness.jpg');
    material.ambientMap = loader.load('../textures/couch/' + texture + '_ambientocclusion.jpg');
    material.metallicMap = loader.load('../textures/couch/' + texture + '_metallic.jpg');
    material.heightMap = loader.load('../textures/couch/' + texture + '_height.jpg');
    material.map = loader.load('../textures/couch/' + texture + '_basecolor.jpg');
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
    rightBackLeg.position.set(x + w / 2 - w / 10, y - h / 4, z + d / 2 - d / 10);
    rightBackLeg.castShadow = true;
    rightBackLeg.receiveShadow = true;
    scene.add(rightBackLeg);
}

function addFrame(name, w, h, d, x, y, z, texture) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    var loader = new THREE.TextureLoader();
    loader.load('../textures/' + texture + '.jpg', function (loadedTexture) {
        material.map = loadedTexture;
        material.needsUpdate = true;
    });

    var frame = new THREE.Mesh(geometry, material);
    frame.name = name;
    frame.position.set(x, y, z);
    frame.castShadow = true;
    frame.receiveShadow = true;

    // Plane için ayrı bir mesh oluşturmak yerine, frame üzerine tıklama işlevi ekleyelim
    frame.userData = { id: name, src: '../textures/' + texture + '.jpg' };

    // Tıklama işlevi
    frame.onClick = () => {
        const fullscreenDiv = document.getElementById('fullscreen');
        const fullscreenImg = document.getElementById('fullscreenImage');
        fullscreenImg.src = frame.userData.src;
        fullscreenDiv.classList.add('active');
    };

    scene.add(frame);
}

function addSpot(name, x, y, z) {
    var vaseGeometry = new THREE.CylinderGeometry(10, 5, 5, 20);
    var vaseMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    var vase = new THREE.Mesh(vaseGeometry, vaseMaterial);

    vase.position.set(x, y, z);
    vase.castShadow = true;
    vase.receiveShadow = true;
    scene.add(vase);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (event) => {
    // Mouse pozisyonunu normalize etme
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Raycaster ile tıklama algılama
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.onClick) object.onClick();
    }
});

document.getElementById('closeFullscreen').addEventListener('click', () => {
    const fullscreenDiv = document.getElementById('fullscreen');
    fullscreenDiv.classList.remove('active');
});

createEnvironment();