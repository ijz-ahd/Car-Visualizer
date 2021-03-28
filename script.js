let cameraFar = 4;
const BACKGROUND_COLOR = 0xf1f1f1;
let theModel;
let loaded = false;
const DRAG_NOTICE = document.getElementById("js-drag-notice");

const canvas = document.getElementById("c");
const selectCarModel = document.querySelector(".cars_option");
let modelPath = selectCarModel.value;

const vehiclePerformanceData = [
  {
    vehicleName: "Nissan GTR",
    bodyType: "Coupe",
    engineType: "twin-turbo V6",
    maxTorque: "637 Nm",
    maxSpeed: "205 mph",
    acceleration: "2.5 s",
    gearbox: "6-speed automatic",
    coolant: "Antifreeze fluid",
    cylinder: "twin-turbocharged 6-cylinder",
    kerb: "3800 lb",
    engMan: "Takumi",
    price: "Rs. 21,200,000",
  },
  {
    vehicleName: "Porsche 911 turbo",
    bodyType: "fixed-head Coupe",
    engineType: "turbo-charged petrol",
    maxTorque: "353 Nm",
    maxSpeed: "155 mph",
    acceleration: "5.2 s",
    gearbox: "4 speed manual",
    coolant: "Air",
    cylinder: "flat 6",
    kerb: "2560 lb",
    engMan: "Porsche",
    price: "Rs. 30,800,000",
  },
];

window.onload = () => (selectCarModel.disabled = false);
selectCarModel.addEventListener("change", function (e) {
  modelPath = e.target.value;
  console.log(modelPath.includes("nissan"));
  if (modelPath.includes("nissan")) {
    document.getElementById("p_heading").innerHTML =
      vehiclePerformanceData[0].vehicleName;
    document.getElementById("p_bodytype").innerHTML =
      vehiclePerformanceData[0].bodyType;
    document.getElementById("p_engtype").innerHTML =
      vehiclePerformanceData[0].engineType;
    document.getElementById("p_engman").innerHTML =
      vehiclePerformanceData[0].engMan;
    document.getElementById("p_kerb").innerHTML =
      vehiclePerformanceData[0].kerb;
    document.getElementById("p_cylinder").innerHTML =
      vehiclePerformanceData[0].cylinder;
    document.getElementById("p_torque").innerHTML =
      vehiclePerformanceData[0].maxTorque;
    document.getElementById("p_acceleration").innerHTML =
      vehiclePerformanceData[0].acceleration;
    document.getElementById("p_speed").innerHTML =
      vehiclePerformanceData[0].maxSpeed;
    document.getElementById("p_gear").innerHTML =
      vehiclePerformanceData[0].gearbox;
    document.getElementById("p_coolant").innerHTML =
      vehiclePerformanceData[0].coolant;
    document.getElementById("price").innerHTML =
      vehiclePerformanceData[0].price;

    document.getElementById("interiorVR").href = "./webvr2.html";
  } else {
    document.getElementById("p_heading").innerHTML =
      vehiclePerformanceData[1].vehicleName;
    document.getElementById("p_bodytype").innerHTML =
      vehiclePerformanceData[1].bodyType;
    document.getElementById("p_engtype").innerHTML =
      vehiclePerformanceData[1].engineType;
    document.getElementById("p_engman").innerHTML =
      vehiclePerformanceData[1].engMan;
    document.getElementById("p_kerb").innerHTML =
      vehiclePerformanceData[1].kerb;
    document.getElementById("p_cylinder").innerHTML =
      vehiclePerformanceData[1].cylinder;
    document.getElementById("p_torque").innerHTML =
      vehiclePerformanceData[1].maxTorque;
    document.getElementById("p_acceleration").innerHTML =
      vehiclePerformanceData[1].acceleration;
    document.getElementById("p_speed").innerHTML =
      vehiclePerformanceData[1].maxSpeed;
    document.getElementById("p_gear").innerHTML =
      vehiclePerformanceData[1].gearbox;
    document.getElementById("p_coolant").innerHTML =
      vehiclePerformanceData[1].coolant;
    document.getElementById("price").innerHTML =
      vehiclePerformanceData[1].price;

    document.getElementById("interiorVR").href = "./webvr.html";
  }

  let canvasCleared = clearCanvas(theModel);
  canvasCleared && loadGLBModel(modelPath);
});

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
    color: "670000",
  },
  {
    color: "002366",
  },
  {
    color: "153944",
  },
  {
    color: "27548D",
  },
  {
    color: "708090",
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

const glass = new THREE.MeshPhongMaterial({
  color: 0x080808,
  shininess: 10,
});

const lamp = new THREE.MeshPhongMaterial({
  color: 0x080808,
  shininess: 10,
});

const INITIAL_MAP = [
  { childID: "body", mtl: INITIAL_MTL },
  // { childID: "mirror", mtl: INITIAL_MTL },
  { childID: "glass", mtl: glass },
  { childID: "lamp", mtl: lamp },
  // { childID: "alloy", mtl: INITIAL_MTL },
  // { childID: "wheel", mtl: INITIAL_MTL },
  { childID: "second_body", mtl: secBody },
];

function loadGLBModel(modelPath) {
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
}

loadGLBModel(modelPath);

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

function clearCanvas(model) {
  let selectedObject = scene.getObjectByName(model.name);
  try {
    if (selectedObject) {
      scene.remove(selectedObject);
      return true;
    }
  } catch (err) {
    console.log(err.message);
    return false;
  }
}
