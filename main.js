import * as THREE from 'https://esm.sh/three@0.155.0';
import { STLLoader } from 'https://esm.sh/three@0.155.0/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.155.0/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://esm.sh/lil-gui';

function degToRad(deg){
    return deg * (Math.PI/180)
}

//Scene initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,10000);
camera.position.z = 10;
const spinParams = {distance : 10, speed : 100}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//Loading textures & using one in a picture as the scene background
const fullMoonNightTexture = new THREE.TextureLoader().load('assets/texture_FullMoon.jpeg');
const uvCheckerTexture = new THREE.TextureLoader().load('assets/texture_Checker.jpg');
const tableTexture = new THREE.TextureLoader().load('assets/texture_Wood.jpg');
const flatColorTexture = new THREE.TextureLoader().load('assets/texture_FlatColor.png');
const gradientTexture = new THREE.TextureLoader().load('assets/texture_Gradient.png');
const otherGradientTexture = new THREE.TextureLoader().load('assets/texture_OtherGradient.png');
scene.background = fullMoonNightTexture;

//Lighting
scene.add(new THREE.AmbientLight(0x36354d, 2)); //Ambient Lighting

//Spotlight initialization
const spotlight = new THREE.SpotLight(0xe09322, 5);
spotlight.position.set(5, 10, 5);
spotlight.angle = Math.PI / 6; 
spotlight.penumbra = 0.3;
spotlight.castShadow = true;
spotlight.intensity = 200;
spotlight.shadow.mapSize.width = 2048;
spotlight.shadow.mapSize.height = 2048;
scene.add(spotlight);

// Table geometry
const tableGeometry = new THREE.BoxGeometry(10, 0.5, 10);
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x7a3d00, map: tableTexture });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, -0.25, 0);
table.receiveShadow = true;
scene.add(table);

//Load STL models
let cakeMeshes = new Array(3);
const loader = new STLLoader();
const modelParamOne = { x: 1.2, y: 0.25, z: 0, rotateY: 0, rotateX: degToRad(-90), rotateZ: degToRad(240), rotating: false };
const modelParamTwo = { x: -0.6, y: 0.25, z: Math.sqrt(3)*.6, rotateY: 0, rotateX: degToRad(-90), rotateZ: degToRad(120), rotating: false };
const modelParamThree = { x: -0.6, y: 0.25, z: -Math.sqrt(3)*.6, rotateY: 0, rotateX: degToRad(-90), rotateZ: 0, rotating: false };
const modelParams = [modelParamOne,modelParamTwo,modelParamThree];
//Load in 3 mooncakes
for (let i=0; i < 3; i++){
    loader.load('models/v1.stl', function (geometry) {
        geometry.computeBoundingBox();
        const size = geometry.boundingBox.getSize(new THREE.Vector3());
        const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    
        const material = new THREE.MeshStandardMaterial({ 
            // map: uvCheckerTexture,
            color: 0xa86002, 
            metalness: 0.005,   
            roughness: 0.5 
        });
    
        cakeMeshes[i] = new THREE.Mesh(geometry, material);
        cakeMeshes[i].scale.set(scaleFactor, scaleFactor, scaleFactor);
        cakeMeshes[i].position.set(-center.x * scaleFactor, 0.5, -center.z * scaleFactor);
        cakeMeshes[i].castShadow = true;
        scene.add(cakeMeshes[i]);

        cakeMeshes[i].position.set(modelParams[i].x, modelParams[i].y, modelParams[i].z);
        cakeMeshes[i].rotation.set(modelParams[i].rotateX, modelParams[i].rotateY, modelParams[i].rotateZ);
        
    });

}

//Load in the other cakes
let newCakeMesh;
let leaningCakeMesh;

loader.load('models/v3.stl', function (geometry) {
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());

    const material = new THREE.MeshStandardMaterial({ 
        color: 0xEAA221, 
        metalness: 0.005,   
        roughness: 0.5 
    });

    newCakeMesh = new THREE.Mesh(geometry, material);
    newCakeMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    newCakeMesh.position.set(-center.x * scaleFactor, 0.5, -center.z * scaleFactor);
    newCakeMesh.castShadow = true;
    scene.add(newCakeMesh);

    newCakeMesh.position.set(0, 0.75, 0);
    newCakeMesh.rotation.set(degToRad(-90), 0, 0);
    
});

loader.load('models/v3.stl', function (geometry) {
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());

    const material = new THREE.MeshStandardMaterial({ 
        color: 0xEAA221, 
        metalness: 0.005,   
        roughness: 0.5 
    });

    leaningCakeMesh = new THREE.Mesh(geometry, material);
    leaningCakeMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    leaningCakeMesh.position.set(-center.x * scaleFactor, 0.5, -center.z * scaleFactor);
    leaningCakeMesh.castShadow = true;
    scene.add(leaningCakeMesh);

    leaningCakeMesh.position.set(2.5, 0.1, 2.5);
    leaningCakeMesh.rotation.set(degToRad(-80), degToRad(6), degToRad(170));
    
});

//Load in the plate
let plateMesh;
loader.load('models/plate.stl', function (geometry) {
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    const scaleFactor = 2 / Math.max(size.x, size.y, size.z);
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());

    const material = new THREE.MeshStandardMaterial({ 
        // map: uvCheckerTexture,
        color: 0xFFFFFF, 
        metalness: 0.3,   
        roughness: 0.2 
    });

    plateMesh = new THREE.Mesh(geometry, material);
    plateMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    plateMesh.position.set(-center.x * scaleFactor, 0.5, -center.z * scaleFactor);
    plateMesh.castShadow = true;
    scene.add(plateMesh);

    plateMesh.position.set(0, -.02, 0);
    plateMesh.rotation.set(degToRad(-90),0,0);
    plateMesh.scale.set(.08,.08,.027);
    
});

//Skybox geometry
// const skyGeometry = new THREE.BoxGeometry(50, 50, 50);
// const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
// const skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
// scene.add(skyBox);

//GUI for components
const gui = new GUI();
const lightFolder = gui.addFolder('Lightsource');
lightFolder.add(spotlight.position, 'x', -20, 20).name("Light X");
lightFolder.add(spotlight.position, 'y', 0, 30).name("Light Y");
lightFolder.add(spotlight.position, 'z', -20, 20).name("Light Z");
lightFolder.add(spotlight, 'intensity', 50, 700).name("Intensity");
lightFolder.add(spotlight, 'angle', 0.1, Math.PI / 2).name("Angle").onChange(() => spotlight.updateMatrix());
lightFolder.add(spotlight, 'penumbra', 0, 1).name("Light softness");
lightFolder.open();

const camFolder = gui.addFolder('Camera');
camFolder.add(spinParams, 'speed', 100,2000).name('Rotating Speed');
camFolder.add(spinParams, 'distance', 2,20).name('Camera Distance');
camFolder.open();

//Camera rotation, used modified Saty's code
function rotateCam(){
    const timer = Date.now()*(1/(2050-spinParams.speed));
    camera.position.x = Math.cos(timer)*spinParams.distance;
    camera.position.z = Math.sin(timer)*spinParams.distance;

    renderer.render(scene, camera);
}

//Interactions
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//Window size monitor
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Animation
function animate() {
    requestAnimationFrame(animate);
    rotateCam();
    controls.update();
}
animate();
