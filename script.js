let cameraFar = 4;
const BACKGROUND_COLOR = 0xf1f1f1;
let theModel;
let loaded = false;
const modelPath = "model/scene.glb";
const DRAG_NOTICE = document.getElementById("js-drag-notice");

const colors = [
  {
    color: "171717",
  },
  {
    color: "000000",
  },
  {
    color: "F4BC1C",
  },
  {
    color: "FFFFFF",
  },
  {
    color: "66533C",
  },
  {
    color: "173A2F",
  },
  {
    color: "153944",
  },
  {
    color: "27548D",
  },
  {
    color: "438AAC",
  },
  {
    color: "D55209",
  },
];

const TRAY = document.getElementById("js-tray-slide");

//init scene
const scene = new THREE.Scene();
//setting up the scene background
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const canvas = document.querySelector("#c");

//init renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

//adjusting gamma output
renderer.outputEncoding = THREE.sRGBEncoding;

//append renderer to window
document.body.appendChild(renderer.domElement);

//init camera and positions
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = cameraFar;
camera.position.x = 0;

// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial({
  color: 0xf1f1f1,
  shininess: 10,
});

const secBody = new THREE.MeshPhongMaterial({
  color: 0x000000,
  shininess: 10,
});

const INITIAL_MAP = [
  { childID: "body", mtl: INITIAL_MTL },
  // { childID: "mirror", mtl: INITIAL_MTL },
  // { childID: "glass", mtl: INITIAL_MTL },
  // { childID: "alloy", mtl: INITIAL_MTL },
  // { childID: "wheel", mtl: INITIAL_MTL },
  { childID: "second_body", mtl: secBody },
];

//init object loader
const loader = new THREE.GLTFLoader();
loader.load(
  modelPath,
  function (gltf) {
    theModel = gltf.scene;

    theModel.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
        // o.material.side = THREE.DoubleSide;
      }
    });
    //set initial scale
    theModel.scale.set(0.5, 0.5, 0.5);
    theModel.rotation.y = Math.PI / 5;

    // offset y-position
    theModel.position.y = -0.4;

    // Set initial textures
    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }

    //add model to scene
    scene.add(theModel);
  },
  undefined,
  function (error) {
    console.log(error.message);
  }
);

// // Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type; // Set a new property to identify this object
        // console.log(o.nameID);
      }
    }
  });
}

// Add lights
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 1.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene
scene.add(dirLight);

// var dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 5);
// scene.add(dirLightHelper);

//add point light
// const light = new THREE.PointLight(0xffffff, 0.5);
// light.position.set(-8, 12, 8);
// scene.add(light);

// const light1 = new THREE.PointLight(0xc4c4c4, 10);
// light1.position.set(500, 100, 0);
// scene.add(light1);

// const light2 = new THREE.PointLight(0xc4c4c4, 10);
// light2.position.set(0, 100, -500);
// scene.add(light2);

// const light3 = new THREE.PointLight(0xc4c4c4, 10);
// light3.position.set(-500, 300, 0);
// scene.add(light3);

// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0x808080,
  shininess: 0,
});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = false;
floor.position.y = -1;
scene.add(floor);

// Add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30

//animating using loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  //resize based on device screen ratio
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix;
  }

  if (theModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add("start");
  }
}

animate();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvasPixelWidth = canvas.width / window.devicePixelRatio;
  let canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors
function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add("tray__swatch");

    swatch.style.background = "#" + color.color;
    swatch.setAttribute("data-key", i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

window.addEventListener("load", function () {
  for (const swatch of swatches) {
    swatch.addEventListener("click", selectSwatch);
  }
});

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  new_mtl = new THREE.MeshPhongMaterial({
    color: parseInt("0x" + color.color),
    shininess: color.shininess ? color.shininess : 10,
  });

  setMaterial(theModel, "body", new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
    // console.log(o.nameID);
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}

let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}
