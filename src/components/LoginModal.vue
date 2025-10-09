<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "login", payload: { username: string; password: string }): void;
}>();

const username = ref("");
const password = ref("");
const handleLogin = () =>
  emit("login", { username: username.value, password: password.value });

/* ===== Snake trail paraméterek ===== */
const CELL = 40; // rács méret (px)
const TRAIL_LEN = 16; // ennyi szegmenst rajzolunk
const SPACING = 18; // min. távolság új pont felvételéhez (px)
const EASE = 0.18; // fej lerp erősség

type Pt = { x: number; y: number };
const head = ref<Pt>({ x: 0, y: 0 });
const target = ref<Pt>({ x: 0, y: 0 });
const trail = ref<Pt[]>([]); // 0 = fejhez legközelebbi, növekvő = halványabb

let raf = 0;
let mouseX = 0,
  mouseY = 0;

const snapToGrid = (x: number, y: number) => ({
  x: Math.round(x / CELL) * CELL,
  y: Math.round(y / CELL) * CELL,
});

function onMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function dist(a: Pt, b: Pt) {
  const dx = a.x - b.x,
    dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function animate(_ts?: number) {
  // cél a rácsra igazítva
  const g = snapToGrid(mouseX, mouseY);
  target.value = { x: g.x - CELL / 2, y: g.y - CELL / 2 };

  // fej simítása
  head.value.x += (target.value.x - head.value.x) * EASE;
  head.value.y += (target.value.y - head.value.y) * EASE;

  // új trail pont csak akkor, ha elég messze kerültünk az utolsótól
  const first = trail.value[0] ?? head.value;
  if (!trail.value.length || dist(head.value, first) >= SPACING) {
    trail.value.unshift({ x: head.value.x, y: head.value.y });
    if (trail.value.length > TRAIL_LEN) trail.value.pop();
  } else {
    // különben kicsit “odébb húzzuk” az első pontot a fejhez, hogy folyamatos legyen
    first.x += (head.value.x - first.x) * 0.5;
    first.y += (head.value.y - first.y) * 0.5;
  }

  raf = requestAnimationFrame(animate);
}

onMounted(() => {
  document.addEventListener("mousemove", onMove, { passive: true });
  // első pozíció induláskor középre rakható, de elég nulláról kezdeni
  raf = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMove);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div class="fixed inset-0 z-50">
    <!-- háttér rács -->
    <div class="absolute inset-0 bg-[#0c0f12] z-0">
      <div class="h-full w-full grid-bg relative overflow-hidden"></div>
    </div>

    <!-- kígyó trail — overlay FÖLÖTT, hogy látsszon a glow -->
    <div class="absolute inset-0 z-20 pointer-events-none">
      <!-- fej külön (erősebb glow) -->
      <div
        class="absolute w-10 h-10 rounded-[3px]"
        :style="{
          transform: `translate(${head.x}px, ${head.y}px)`,
          background: '#6dff52',
          filter: 'saturate(120%)',
          mixBlendMode: 'screen',
          opacity: 0.95,
          boxShadow:
            '0 0 28px rgba(132,255,97,.6), inset 0 0 10px rgba(0,0,0,.35)',
        }"
      />
      <!-- farok szegmensek (halványuló/enyhén zsugorodó) -->
      <div
        v-for="(p, i) in trail"
        :key="i"
        class="absolute rounded-[3px]"
        :style="{
          width: `${CELL}px`,
          height: `${CELL}px`,
          transform: `translate(${p.x}px, ${p.y}px) scale(${
            1 - i * (0.45 / TRAIL_LEN)
          })`,
          background: '#6dff52',
          mixBlendMode: 'screen',
          opacity: Math.max(0, 0.9 - i * (0.9 / TRAIL_LEN)).toString(),
          boxShadow: `0 0 ${18 - i * (12 / TRAIL_LEN)}px rgba(132,255,97,${
            0.45 - i * (0.4 / TRAIL_LEN)
          })`,
          transition: 'opacity 120ms linear',
        }"
      />
    </div>

    <!-- sötét overlay -->
    <div class="absolute inset-0 bg-black/55 z-10"></div>

    <!-- kártya -->
    <div
      class="relative h-full w-full flex items-center justify-center p-4 z-30"
    >
      <div
        class="w-[380px] rounded-xl bg-[#121417] text-gray-100 shadow-2xl card-glow"
      >
        <div class="px-7 pt-6 pb-7">
          <div class="text-center mb-6">
            <div
              class="text-[13px] tracking-[.35em] font-semibold text-[#84ff61]"
            >
              SIGN IN
            </div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1">
              <label
                for="username"
                class="text-xs uppercase tracking-wide text-gray-400"
                >Username</label
              >
              <input
                v-model="username"
                id="username"
                type="text"
                autocomplete="username"
                required
                class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
              />
            </div>

            <div class="space-y-1">
              <label
                for="password"
                class="text-xs uppercase tracking-wide text-gray-400"
                >Password</label
              >
              <input
                v-model="password"
                id="password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
              />
            </div>

            <div class="flex items-center justify-between text-[13px]">
              <a href="#" class="text-gray-400 hover:text-[#84ff61]"
                >Forgot Password</a
              >
              <a href="#" class="text-[#84ff61] hover:underline">Signup</a>
            </div>

            <button
              type="submit"
              class="mt-2 w-full rounded-md bg-[#84ff61] py-2.5 text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90"
            >
              Login
            </button>

            <button
              type="button"
              class="mt-2 w-full rounded-md border border-neutral-700 bg-transparent py-2 text-sm text-gray-300 hover:bg-neutral-800/60"
              @click="emit('close')"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-bg {
  background-image: linear-gradient(
      rgba(90, 255, 120, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(90, 255, 120, 0.05) 1px, transparent 1px),
    radial-gradient(
      800px 400px at 70% 20%,
      rgba(90, 255, 120, 0.06),
      transparent 60%
    );
  background-size: 40px 40px, 40px 40px, auto;
  background-position: 0 0, 0 0, center;
}
.card-glow {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(120, 255, 120, 0.03), 0 0 24px rgba(100, 255, 110, 0.08);
}
</style>
