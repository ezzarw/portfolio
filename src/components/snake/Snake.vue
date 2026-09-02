<template>
  <div tabindex="0" @keydown="moveSnake" class="relative outline-none">
    <canvas
      ref="canvasRef"
      class="bg-[#010C15] border border-[#1E2D3D] rounded-lg"
      :width="`${CANVAS_SIZE[0]}px`"
      :height="`${CANVAS_SIZE[1]}px`"
    />
    <div
      v-if="gameOver"
      class="absolute bottom-24 left-1/2 -translate-x-1/2 text-[#43D9AD] py-3 w-full rounded-lg text-center text-2xl bg-[#011627]/[84%] inner-shadow-snake transition-all"
    >
      GAME OVER!
    </div>
    <button
      type="button"
      @click="startGame"
      :class="[
        'absolute text-sm bottom-10 left-1/2 -translate-x-1/2 bg-[#FEA55F] py-2.5 px-[14px] rounded-lg transition-all',
        hideStartBtn ? 'opacity-0 cursor-default' : null
      ]"
    >
      start-game
    </button>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watchEffect } from "vue";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";

const props = defineProps({
  scoreSnake: {
    type: Function,
    default: () => {},
  },
});

const canvasRef = ref(null);
const snake = ref(SNAKE_START);
const apple = ref(APPLE_START);
const dir = ref([0, -1]);
const speed = ref(null);
const gameOver = ref(false);
const hideStartBtn = ref(false);
let timerId = null;

const createApple = () =>
  apple.value.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

const checkCollision = (piece, snk = snake.value) => {
  if (
    piece[0] * SCALE >= CANVAS_SIZE[0] ||
    piece[0] < 0 ||
    piece[1] * SCALE >= CANVAS_SIZE[1] ||
    piece[1] < 0
  )
    return true;

  for (const segment of snk) {
    if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
  }
  return false;
};

const checkAppleCollision = (newSnake) => {
  if (newSnake[0][0] === apple.value[0] && newSnake[0][1] === apple.value[1]) {
    let newApple = createApple();
    while (checkCollision(newApple, newSnake)) {
      newApple = createApple();
    }
    apple.value = newApple;
    return true;
  }
  return false;
};

const endGame = () => {
  speed.value = null;
  if (timerId) clearInterval(timerId);
  gameOver.value = true;
  hideStartBtn.value = false;
};

const gameLoop = () => {
  const snakeCopy = JSON.parse(JSON.stringify(snake.value));
  const newSnakeHead = [snakeCopy[0][0] + dir.value[0], snakeCopy[0][1] + dir.value[1]];
  snakeCopy.unshift(newSnakeHead);
  if (checkCollision(newSnakeHead)) endGame();
  if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
  snake.value = snakeCopy;
  props.scoreSnake(snake.value.length - 2);
};

const moveSnake = (e) => {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    dir.value = DIRECTIONS[e.keyCode];
  }
};

const startGame = () => {
  snake.value = SNAKE_START;
  apple.value = APPLE_START;
  dir.value = [0, -1];
  speed.value = SPEED;
  gameOver.value = false;
  hideStartBtn.value = true;
  if (timerId) clearInterval(timerId);
  timerId = setInterval(gameLoop, SPEED);
};

watchEffect(() => {
  if (!canvasRef.value) return;
  const context = canvasRef.value.getContext("2d");
  context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.fillStyle = "#43d9ad";
  snake.value.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
  context.fillStyle = "#43d9ad";
  context.fillRect(apple.value[0], apple.value[1], 1, 1);
});

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});
</script>
