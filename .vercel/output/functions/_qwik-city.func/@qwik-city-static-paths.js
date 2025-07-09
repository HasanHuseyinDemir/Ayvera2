const staticPaths = new Set(["/ayvera.png","/ayvera.svg","/brands/avtech.png","/brands/cambox.jpeg","/brands/everday.jpeg","/brands/fonri.jpeg","/brands/idex.jpeg","/brands/imou.jpeg","/brands/kodicom.jpeg","/brands/radem.jpeg","/brands/rubezh.jpeg","/brands/teletek.jpeg","/brands/tiandy.jpeg","/brands/zkt.jpeg","/favicon.ico","/favicon.png","/ico.svg","/kamera.png","/manifest.json","/q-manifest.json","/robots.txt","/sitemap.xml","/stock/aparat.png","/stock/cam.png","/stock/camera.png","/stock/evguvenlik.png","/stock/gecis.png","/stock/kablo.png","/stock/ses.png","/stock/yangin.png","/video/ay2.mp4","/video/ayvera.mkv","/video/ayvera.mp4","/video/ayvera2.mp4","/video/bg1.webm","/video/cctv.mp4","/video/compress/ayvera.mp4","/video/compress/ayvera22.mp4","/video/compress/bg1.mp4","/video/compress/cctv.mp4","/video/yangin.mp4"]);
function isStaticPath(method, url) {
  if (method.toUpperCase() !== 'GET') {
    return false;
  }
  const p = url.pathname;
  if (p.startsWith("/build/")) {
    return true;
  }
  if (p.startsWith("/assets/")) {
    return true;
  }
  if (staticPaths.has(p)) {
    return true;
  }
  if (p.endsWith('/q-data.json')) {
    const pWithoutQdata = p.replace(/\/q-data.json$/, '');
    if (staticPaths.has(pWithoutQdata + '/')) {
      return true;
    }
    if (staticPaths.has(pWithoutQdata)) {
      return true;
    }
  }
  return false;
}
export { isStaticPath };