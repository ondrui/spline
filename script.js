//-------------------

const svg = document.querySelector('#svg');

const a = [130, 60];
const ab = [190, 30];
const c = [150+100, 60];
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

const aPath = `<path class="a-path" d="M ${a[0]} ${a[1]} L ${ab[0]} ${ab[1]}" stroke="grey" />`;
const aPerpendicular = `<path class="a-perp" d="M ${a[0]} ${a[1]} L ${-Math.sin(angleAB) * dist + a[0]} ${(Math.cos(angleAB) * dist + a[1])}" stroke="grey" />`;

const bPath = `<path class="b-path" d="M ${ab[0]} ${ab[1]} L ${c[0]} ${c[1]}" stroke="green" />`;
const bPerpendicular = `<path class="b-perp" d="M ${c[0]} ${c[1]} L ${-Math.sin(angleBC) * dist + c[0]} ${(Math.cos(angleBC) * dist + c[1])}" stroke="green" />`;

svg.innerHTML = aPath + bPath + aPerpendicular + bPerpendicular;

const apath = document.querySelector(".a-path");
const bpath = document.querySelector(".b-path");

console.log("bPath", bpath.getTotalLength());
console.log("aPath", apath.getTotalLength());

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
let dt = Math.sqrt((o[0]-a[0])**2+(o[1]-a[1])**2);

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
