// Thor Recorder (made by Shyam) – user-initiated screen/tab/window recording.
const $ = (id) => document.getElementById(id);
let recorder = null, chunks = [], streams = [], tick = null, t0 = 0, blobUrl = null, blob = null;

const say = (t) => ($("msg").textContent = t || "");
const mm = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

function pickMime() {
  const c = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
  return c.find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || "";
}

function cleanup() {
  streams.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  streams = [];
  clearInterval(tick);
  $("dot").style.display = "none";
  $("start").disabled = false;
  $("stop").disabled = true;
}

async function start() {
  say("");
  try {
    const display = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 }, audio: $("sysAudio").checked
    });
    streams.push(display);
    const tracks = [...display.getVideoTracks(), ...display.getAudioTracks()];
    if ($("mic").checked) {
      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        streams.push(mic);
        tracks.push(...mic.getAudioTracks());
      } catch (e) { say("Microphone unavailable – recording without it."); }
    }
    const mime = pickMime();
    chunks = [];
    recorder = new MediaRecorder(new MediaStream(tracks), mime ? { mimeType: mime } : undefined);
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = finish;
    // Stops cleanly if the user clicks the browser's own "Stop sharing" button.
    display.getVideoTracks()[0].addEventListener("ended", () => { if (recorder && recorder.state !== "inactive") recorder.stop(); });
    recorder.start(1000);
    $("result").style.display = "none";
    $("start").disabled = true; $("stop").disabled = false; $("dot").style.display = "inline-block";
    t0 = Date.now();
    $("timer").textContent = "00:00";
    tick = setInterval(() => ($("timer").textContent = mm(Math.floor((Date.now() - t0) / 1000))), 500);
  } catch (e) {
    cleanup();
    say(e && e.name === "NotAllowedError" ? "Recording cancelled." : "Could not start: " + (e && e.message));
  }
}

function finish() {
  const type = (recorder && recorder.mimeType) || "video/webm";
  blob = new Blob(chunks, { type });
  cleanup();
  if (blobUrl) URL.revokeObjectURL(blobUrl);
  blobUrl = URL.createObjectURL(blob);
  $("player").src = blobUrl;
  $("result").style.display = "block";
  say("Saved in this tab – " + (blob.size / 1048576).toFixed(1) + " MB.");
}

$("start").addEventListener("click", start);
$("stop").addEventListener("click", () => { if (recorder && recorder.state !== "inactive") recorder.stop(); });
$("newRec").addEventListener("click", () => { $("result").style.display = "none"; say(""); });

$("download").addEventListener("click", () => {
  if (!blobUrl) return;
  const ext = blob.type.includes("mp4") ? "mp4" : "webm";
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = "thor-recording-" + new Date().toISOString().replace(/[:.]/g, "-") + "." + ext;
  a.click();
});

$("copyFrame").addEventListener("click", async () => {
  const v = $("player");
  if (!v.videoWidth) { say("Play or seek the video first, then copy a frame."); return; }
  const c = document.createElement("canvas");
  c.width = v.videoWidth; c.height = v.videoHeight;
  c.getContext("2d").drawImage(v, 0, 0);
  try {
    const png = await new Promise((res) => c.toBlob(res, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
    say("Frame copied – paste it with Ctrl+V.");
  } catch (e) { say("Copy failed: " + (e && e.message)); }
});
