//-------------------

const svg = document.querySelector('#svg');

const a = [130, 60];
const ab = [190, 30];
const c = [250, 60];
const dist = 180;

//Длина отрезка по координатам
const lengthSegment = (start, end) => Math.hypot((end[1] - start[1]), (end[0] - start[0]));

const lengthAB = lengthSegment(a, ab);
console.log("lengthAB", lengthAB);

const lengthBC = lengthSegment(ab, c);
console.log("lengthBC", lengthBC);

//Находим угол в радианах

const angle = (start, end) => Math.atan2((end[1] - start[1]), (end[0] - start[0]));

const angleAB = angle(a, ab);
console.log("angleAB", angleAB);
const angleBC = angle(ab, c);
console.log("angleBC", angleBC);

const angleCB = angle(c, ab);
console.log("angleCB", angleCB);

const angleBA = angle(ab, a);
console.log("angleBA", angleBA);


// 1. Строим перпендикуляры до пересечения

const showPath = (start, end, cl, col) => `<path class=${cl} d="M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}" stroke=${col} />`;
const showPerpendicular = (start, len, angle, cl, col) => `<path class=${cl} d="M ${start[0]} ${start[1]} L ${-Math.sin(angle) * len + start[0]} ${(Math.cos(angle) * len + start[1])}" stroke=${col} />`;

const aPath = showPath(a, ab, "a-path", "grey");
const aPerpendicular = showPerpendicular(a, dist, angleAB, "a-perp", "grey");

const bPath = showPath(ab, c, "b-path", "green");
const bPerpendicular = showPerpendicular(c, dist, angleBC, "b-perp", "green");

svg.innerHTML = aPath + bPath + aPerpendicular + bPerpendicular;

// 2. Находим координату точки пересечения перпендикуляров и радиус дуги

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

	return [x, y]
}

let o = intersect(a[0], a[1], (-Math.sin(angleAB) * dist + a[0]), (Math.cos(angleAB) * dist + a[1]), c[0], c[1], (-Math.sin(angleBC) * dist + c[0]), (Math.cos(angleBC) * dist + c[1]));

console.log(o);

// let dt1 = Math.sqrt((x2-x1)**2+(y2-y1)**2);
// let dt = Math.sqrt((o[0]-a[0])**2+(o[1]-a[1])**2);
let dt = Math.hypot((o[0]-a[0]),(o[1]-a[1]));

console.log(dt);

//3. Строим дугу

const arc = `<path d="M ${a[0]} ${a[1]} A ${dt} ${dt} 0 0 1 ${c[0]} ${c[1]}" stroke="grey" fill="none" />`;

svg.innerHTML += arc;


//--------------
//x1=lsinθ+x
//y1=lcosθ+y

const points = (arr, angle) => {
  const x1 = 200 * -Math.sin(angle) + arr[0];
  const y1 = 200 * Math.cos(angle) + arr[1];
  return [x1, y1];
}

console.log(points(a, angleAB));
console.log(points(c, angleBC));

//------------------
//==================
const e = [50, 400];
const d = [400, 550];

const pathDE = showPath(d, e, "d-path", "teal");

svg.innerHTML += pathDE;

function getPerpOfLine(x1,y1,x2,y2){ // the two points can not be the same
	var nx = x2 - x1;  // as vector
	var ny = y2 - y1;
	const len = Math.sqrt(nx * nx + ny * ny);  // length of line
	nx /= len;  // make one unit long
	ny /= len;  // which we call normalising a vector
	return [-ny * 50, nx * 50]; // return the normal  rotated 90 deg
}

console.log(getPerpOfLine(d[0], d[1], e[0], e[1]));

const perpDE = showPath(e, getPerpOfLine(d[0], d[1], e[0], e[1]), "d-perp", "orange");

svg.innerHTML += perpDE;
