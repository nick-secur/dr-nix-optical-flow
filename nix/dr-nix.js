
/*
todo start playing with the math

how are you going to define a threshold to signal relative motion detection (i.e., fluid or powder)?

Consider that you have: (1) a vector which represents the overall viz field flow, and (2) an array of vectors representing flow for some number of zones...

Things to look at:

1. VARIANCE of zone vectors

2. deviations of zone vectors from mean (i.e., overall flow)

Also, toward visualization, look at associating magnitude and direction of zone vectors with colors...


*/

const videoElement = document.getElementById( 'test-vid' );
const canvas = document.getElementById('flow-canvas');
const graphicsCtx = canvas.getContext( '2d' );
const testBox = document.getElementById( 'test-box-display' );

testBox.innerText = "TEST";

//todo  zoneSize ~~ and the convolution matrix
//const zoneSize = 8;
//const zoneSize = 64;
let zoneSize = 100;
document.getElementById('zone-size-display').innerText = zoneSize;
let scaleFactor = 0.75;
let flowObj;
let vidW, vidH;

videoElement.addEventListener( "loadedmetadata", function (e) {
    vidW = videoElement.videoWidth;
    vidH = videoElement.videoHeight;
    // [1920, 1080]
    videoElement.setAttribute("width", "" + (vidW * scaleFactor));
    videoElement.setAttribute("height", "" + (vidH * scaleFactor));
    canvas.setAttribute("width", "" + (vidW * scaleFactor));
    canvas.setAttribute("height", "" + (vidH * scaleFactor));
}, false );


function go () {

    flowObj = new oflow.VideoFlow(videoElement, zoneSize);

    // flowObj = new oflow.VideoFlow(videoElement, zoneSize);
    flowObj.onCalculated(function (direction) {
        // direction is an object which describes current flow:
        // direction.u, direction.v {floats} general flow vector
        // direction.zones {Array} is a collection of flowZones.
        // Each flow zone describes optical flow direction inside of it.
        // flowZone : {
        //  x, y // zone center
        //  u, v // vector of flow in the zone
        // }

        clearCanvas(canvas);
        graphicsCtx.fillStyle = "#FF0000";
        drawVector(graphicsCtx, canvas.width / 2, canvas.height / 2, direction.u * scaleFactor, direction.v * scaleFactor);
        graphicsCtx.fillStyle = "#0000FF";
        direction.zones.forEach(z => {
            drawVector(
                graphicsCtx,
                z.x * scaleFactor,
                z.y * scaleFactor,
                z.u * scaleFactor,
                z.v * scaleFactor
            );
        });

        let testText = "[ ";
        testText += round2(direction.u);
        testText += ", ";
        testText += round2(direction.v);
        testText += " ]";

        testBox.innerText = testText;

    });

    flowObj.startCapture();


    let testEnd;
    setTimeout( () => {
        console.log( "capture end" );
        testEnd = testBox.innerText;
        console.log( testEnd );
        flowObj.stopCapture();
    }, 1000 * 60 - 100 ) ;

    setTimeout( () => {
        console.log( "end state" );
        testBox.innerText = testEnd;
        flowObj = null;
    }, 1000 * 60 + 100 ) ;



}

document.getElementById('go-button').onclick = go;


function clearCanvas( canvas ) {
    const graphicsCtx = canvas.getContext( '2d' );
    graphicsCtx.clearRect( 0, 0, canvas.width, canvas.height);
    graphicsCtx.fillStyle = "#eeeeee";
    graphicsCtx.fillRect( 0, 0, canvas.width, canvas.height);
}

function drawVector ( ctx, x, y, u, v ) {
    ctx.beginPath();
    ctx.moveTo( x, y );
    ctx.lineTo( x+u, y+v );
    ctx.arc( x, y, 1, 0, 2 );
    ctx.fill();
}

function round2(num) {
    return (Math.round ( num * 100 ) / 2 );
}

function setZones(event)  {
    event.preventDefault();
    zoneSize = parseInt ( document.getElementById("zone-size").value );
    document.getElementById('zone-size-display').innerText = zoneSize;
}


const numZonesInput = document.getElementById("zone-size");
const numZonesButton = document.getElementById("zone-size-button");

numZonesButton.addEventListener("click", setZones);
numZonesInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        zoneSize = parseInt ( event.target.value );
        document.getElementById('zone-size-display').innerText = zoneSize;
    }
});

const scaleButton = document.getElementById("scale-button");
const scaleInput = document.getElementById("scale");
scaleButton.addEventListener("click", (event) => {
    event.preventDefault();
    // todo: set the scale
    scaleFactor = parseFloat ( document.getElementById("scale").value );

    console.log( scaleFactor );

    vidW = videoElement.videoWidth;
    vidH = videoElement.videoHeight;
    videoElement.setAttribute("width", "" + (vidW * scaleFactor));
    videoElement.setAttribute("height", "" + (vidH * scaleFactor));
    canvas.setAttribute("width", "" + (vidW * scaleFactor));
    canvas.setAttribute("height", "" + (vidH * scaleFactor));
});

const videoButton = document.getElementById("video-name-button");
const videoName = document.getElementById("video-name");
videoButton.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("video-name").value ;
    const vidSrcElem = document.getElementById("vid-source-tag");
    vidSrcElem.setAttribute("src", "./vid/" + name ) ;
    videoElement.load();
});
