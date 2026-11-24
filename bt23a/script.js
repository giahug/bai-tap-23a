// Lấy các phần tử HTML theo id để thao tác
const timeSelect = document.getElementById('timeSelect'); // Ô chọn thời gian
const startBtn   = document.getElementById('startBtn');   // Nút Bắt đầu
const colorBtn   = document.getElementById('colorBtn');   // Nút Đổi màu nền
const playerBtn  = document.getElementById('playerBtn');  // Nút Người chơi
const playerInfo = document.getElementById('playerInfo'); // Dòng hiển thị mã sinh viên
const timeLeftEl = document.getElementById('timeLeft');   // Chỗ hiện thời gian còn lại
const scoreEl    = document.getElementById('score');      // Chỗ hiện điểm
const reactionEl = document.getElementById('reaction');   // Chỗ hiện thời gian phản xạ
const gameArea   = document.getElementById('gameArea');   // Khu vực chơi
const target     = document.getElementById('target');     // Mục tiêu cần click
const resultBox  = document.getElementById('result');     // Bảng kết quả
const finalScore = document.getElementById('finalScore'); // Chỗ hiện tổng điểm cuối
const replayBtn  = document.getElementById('replayBtn');  // Nút Chơi lại

let score = 0;        // Biến lưu điểm hiện tại
let timeLeft = 0;     // Biến lưu số giây còn lại
let timerId = null;   // Biến lưu mã của bộ đếm giờ để dừng sau này
let playing = false;  // Trạng thái: true khi đang chơi
let appearTime = 0;   // Thời điểm mục tiêu xuất hiện (để tính phản xạ)

// Hàm tạo màu ngẫu nhiên dạng #rrggbb
function randomColor() {
  const n = Math.floor(Math.random() * 16777216);          // Số ngẫu nhiên từ 0 đến 16777215 (0xFFFFFF)
  return '#' + n.toString(16).padStart(6, '0');            // Đổi sang hệ 16, đủ 6 ký tự, thêm dấu #
}

// Yêu cầu 1: bấm nút thì đổi màu nền ngẫu nhiên
colorBtn.addEventListener('click', function () {
  document.body.style.backgroundColor = randomColor();     // Gán màu ngẫu nhiên cho nền trang
});

// Yêu cầu 2: bấm nút Người chơi thì hiện mã sinh viên
playerBtn.addEventListener('click', function () {
  playerInfo.textContent = 'Người chơi: Lu Gia Hưng - MSSV: 255A010006'; // Hiển thị thông tin
});

// Hàm đặt mục tiêu ở vị trí ngẫu nhiên trong khu vực chơi
function moveTarget() {
  const maxX = gameArea.clientWidth - target.offsetWidth;  // Vị trí ngang lớn nhất để không tràn
  const maxY = gameArea.clientHeight - target.offsetHeight;// Vị trí dọc lớn nhất để không tràn
  target.style.left = Math.floor(Math.random() * maxX) + 'px'; // Tọa độ trái ngẫu nhiên
  target.style.top  = Math.floor(Math.random() * maxY) + 'px'; // Tọa độ trên ngẫu nhiên
  target.style.display = 'block';                          // Hiện mục tiêu
  appearTime = Date.now();                                 // Ghi lại thời điểm xuất hiện (mili giây)
}

// Hàm cập nhật số liệu lên màn hình
function updateStats() {
  timeLeftEl.textContent = timeLeft;                       // Hiện thời gian còn lại
  scoreEl.textContent = score;                             // Hiện điểm
}

// Yêu cầu 3: bấm Bắt đầu thì chạy đồng hồ đếm ngược theo thời gian đã chọn
startBtn.addEventListener('click', function () {
  if (playing) return;                                     // Đang chơi rồi thì không làm gì
  score = 0;                                               // Đặt lại điểm về 0
  timeLeft = Number(timeSelect.value);                     // Lấy số giây từ ô chọn (đổi chuỗi sang số)
  reactionEl.textContent = '-';                            // Xóa thời gian phản xạ cũ
  playing = true;                                          // Đánh dấu đang chơi
  startBtn.disabled = true;                                // Khóa nút Bắt đầu
  timeSelect.disabled = true;                              // Khóa ô chọn thời gian
  resultBox.classList.add('hidden');                       // Ẩn bảng kết quả
  updateStats();                                           // Cập nhật số liệu
  moveTarget();                                            // Hiện mục tiêu đầu tiên
  timerId = setInterval(tick, 1000);                       // Cứ mỗi 1000ms gọi hàm tick một lần
});

// Hàm chạy mỗi giây: giảm thời gian
function tick() {
  timeLeft--;                                              // Giảm 1 giây
  updateStats();                                           // Cập nhật màn hình
  if (timeLeft <= 0) endGame();                            // Về 0 thì kết thúc
}

// Khi click vào mục tiêu: cộng điểm và chuyển mục tiêu sang chỗ khác
target.addEventListener('click', function () {
  if (!playing) return;                                    // Không chơi thì bỏ qua (đã khóa)
  score++;                                                 // Cộng 1 điểm
  reactionEl.textContent = (Date.now() - appearTime) + ' ms'; // Tính thời gian phản xạ
  updateStats();                                           // Cập nhật điểm
  moveTarget();                                            // Dời mục tiêu sang vị trí mới
});

// Hàm kết thúc trò chơi: khóa mọi thao tác và hiện tổng điểm
function endGame() {
  clearInterval(timerId);                                  // Dừng đồng hồ
  playing = false;                                         // Đánh dấu hết chơi
  target.style.display = 'none';                           // Ẩn mục tiêu
  startBtn.disabled = true;                                // Khóa nút Bắt đầu
  colorBtn.disabled = true;                                // Khóa nút Đổi màu nền
  playerBtn.disabled = true;                               // Khóa nút Người chơi
  timeSelect.disabled = true;                              // Khóa ô chọn thời gian
  finalScore.textContent = score;                          // Ghi tổng điểm vào bảng kết quả
  resultBox.classList.remove('hidden');                    // Hiện bảng kết quả (phủ lên khu vực chơi)
}

// Nút Chơi lại: mở khóa để bắt đầu ván mới
replayBtn.addEventListener('click', function () {
  startBtn.disabled = false;                               // Mở nút Bắt đầu
  colorBtn.disabled = false;                               // Mở nút Đổi màu nền
  playerBtn.disabled = false;                              // Mở nút Người chơi
  timeSelect.disabled = false;                             // Mở ô chọn thời gian
  resultBox.classList.add('hidden');                       // Ẩn bảng kết quả
  timeLeft = 0; score = 0; updateStats();                  // Đặt lại số liệu về 0
});
