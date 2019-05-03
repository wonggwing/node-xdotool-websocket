const cp = require("child_process");
const io = require("socket.io")();
io.on("connection", socket => {
  console.log("client connected");
  socket.on("m", (x, y) => {
    mouseMoveRelative(x, y);
  });
  socket.on("d", bmask => {
    mouseDown(bmask);
  });
  socket.on("c", bmask => {
    mouseClick(bmask);
  });
});
io.listen(3000);

var bash = cp.spawn("bash");
global.x = 0;
global.y = 0;
setInterval(function() {
  if (x !== 0 || y !== 0) {
    // console.log(x, y);
    bash.stdin.write(`xdotool mousemove_relative -- ${x} ${y}\n`);
    x = y = 0;
  }
}, 32);

function mouseMoveRelative(x, y) {
  global.x += x;
  global.y += y;
  // bash.stdin.write(`xdotool mousemove_relative -- ${x} ${y}\n`);
}

bash.on("error", function(code) {
  console.log("error with code " + code);
});

bash.on("close", function(code) {
  console.log("closed with code " + code);
});

bash.on("exit", function(code) {
  console.log("exited with code " + code);
});

function mouseDown(bmask) {
  bash.stdin.write(`xdotool mousedown ${bmask}\n`);
}

function mouseClick(bmask) {
  bash.stdin.write(`xdotool click ${bmask} && xdotool mouseup ${bmask}\n`);
}
