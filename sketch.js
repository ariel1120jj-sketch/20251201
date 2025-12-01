// 全域變數

// 站立動畫資源
let idleSpriteSheet;
let idleAnimation = [];
const IDLE_FRAME_WIDTH = 58;
const IDLE_FRAME_HEIGHT = 95;
const NUM_IDLE_FRAMES = 8;

// 走路動畫資源
let walkSpriteSheet;
let walkAnimation = [];
const WALK_FRAME_WIDTH = 67;
const WALK_FRAME_HEIGHT = 100;
const NUM_WALK_FRAMES = 7;

// 角色狀態
let x, y; // 角色位置
let isWalkingRight = false; // 角色是否正在向右走
let isWalkingLeft = false;  // 角色是否正在向左走

/**
 * 預載入：在 setup() 和 draw() 之前載入所有資源。
 */
function preload() {
  // 載入站立和走路的精靈圖
  idleSpriteSheet = loadImage('1(G-Stop)/1(G-Stop-All).png');
  walkSpriteSheet = loadImage('1(G-walk)/1(G-walk-All).png');
}

/**
 * 設定：只執行一次，用於初始化。
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色位置在畫面中央
  x = width / 2;
  y = height / 2;
  
  // 將站立精靈圖切割成單獨的影格
  for (let i = 0; i < NUM_IDLE_FRAMES; i++) {
    // 為了避免擷取到相鄰影格的邊緣像素（看起來像邊框），
    // 我們將擷取起點向內移動 1px，並將擷取寬高各減去 2px。
    const x_start = i * IDLE_FRAME_WIDTH + 1;
    let frame = idleSpriteSheet.get(x_start, 1, IDLE_FRAME_WIDTH - 2, IDLE_FRAME_HEIGHT - 2);
    idleAnimation.push(frame);
  }
  
  // 將走路精靈圖切割成單獨的影格
  for (let i = 0; i < NUM_WALK_FRAMES; i++) {
    let frame = walkSpriteSheet.get(i * WALK_FRAME_WIDTH, 0, WALK_FRAME_WIDTH, WALK_FRAME_HEIGHT);
    walkAnimation.push(frame);
  }
  
  imageMode(CENTER);
}

/**
 * 繪製：連續執行，用於動畫和繪圖。
 */
function draw() {
  background('#e9edc9');
  
  let currentFrame;
  let currentAnimation;
  
  if (isWalkingRight) {
    // 如果正在走路，更新 x 座標並播放走路動畫
    x += 3; // 走路速度
    currentAnimation = walkAnimation;
    currentFrame = floor(frameCount / 4) % NUM_WALK_FRAMES;
    
    // 繪製目前的動畫影格
    image(currentAnimation[currentFrame], x, y);

  } else if (isWalkingLeft) {
    // 如果正在向左走，更新 x 座標並播放走路動畫
    x -= 3; // 走路速度
    currentAnimation = walkAnimation;
    currentFrame = floor(frameCount / 4) % NUM_WALK_FRAMES;

    push(); // 保存目前的繪圖狀態
    scale(-1, 1); // 水平翻轉畫布
    image(currentAnimation[currentFrame], -x, y); // 在翻轉後的畫布上繪製圖片
    pop(); // 恢復原本的繪圖狀態
  } else {
    // 否則，播放站立動畫
    currentAnimation = idleAnimation;    
    // 使用 % (modulo) 運算子實現標準循環播放。
    // 動畫會從影格 0 播放到 7，然後再回到 0 重新開始。
    // floor(frameCount / 16) 控制動畫速度，每 16 個繪圖幀切換一次影格。
    currentFrame = floor(frameCount / 16) % NUM_IDLE_FRAMES;

    // 繪製目前的動畫影格
    image(currentAnimation[currentFrame], x, y);
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    isWalkingRight = true;
  } else if (keyCode === LEFT_ARROW) {
    isWalkingLeft = true;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    isWalkingRight = false;
  } else if (keyCode === LEFT_ARROW) {
    isWalkingLeft = false;
  }
}

/**
 * 視窗尺寸改變時自動調整畫布大小
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}