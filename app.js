const videos = [
  {
    title: "街头慢动作",
    desc: "#city #slowmo",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-futuristic-tunnel-2937-large.mp4",
  },
  {
    title: "海边黄昏",
    desc: "#travel #sunset",
    src: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
  },
  {
    title: "山间云海",
    desc: "#nature #relax",
    src: "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4",
  },
];

const feed = document.getElementById("feed");
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

let currentIndex = 0;
let likes = 0;
let isAnimating = false;

function renderFeed() {
  feed.innerHTML = videos
    .map(
      (item, index) => `
        <section class="video-card" data-index="${index}">
          <video src="${item.src}" loop playsinline preload="metadata"></video>
          <div class="overlay">
            <h2>@user${index + 1} · ${item.title}</h2>
            <p>${item.desc}</p>
          </div>
        </section>
      `
    )
    .join("");

  playCurrentVideo();
}

function playCurrentVideo() {
  const allVideos = feed.querySelectorAll("video");
  allVideos.forEach((video, i) => {
    if (i === currentIndex) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

function moveTo(index) {
  if (index < 0 || index >= videos.length || isAnimating) return;

  isAnimating = true;
  currentIndex = index;
  feed.style.transform = `translateY(-${currentIndex * 100}vh)`;
  playCurrentVideo();

  setTimeout(() => {
    isAnimating = false;
  }, 350);
}

function nextVideo() {
  moveTo(Math.min(currentIndex + 1, videos.length - 1));
}

function prevVideo() {
  moveTo(Math.max(currentIndex - 1, 0));
}

window.addEventListener("wheel", (event) => {
  if (event.deltaY > 0) nextVideo();
  else prevVideo();
});

let touchStartY = 0;
window.addEventListener("touchstart", (event) => {
  touchStartY = event.changedTouches[0].clientY;
});

window.addEventListener("touchend", (event) => {
  const touchEndY = event.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  if (Math.abs(diff) < 50) return;
  if (diff > 0) nextVideo();
  else prevVideo();
});

likeBtn.addEventListener("click", () => {
  likes += 1;
  likeCount.textContent = likes;
});

renderFeed();
