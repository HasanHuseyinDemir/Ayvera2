const staticPaths = new Set(["/aparat.png","/ayvera.mkv","/ayvera.mp4","/ayvera.png","/ayvera.svg","/ayvera2.mp4","/ayvera22.mp4","/bg1.webm","/cam.png","/camera.png","/evguvenlik.png","/favicon.png","/gecis.png","/ico.svg","/kablo.png","/kamera.png","/manifest.json","/q-manifest.json","/robots.txt","/ses.png","/sitemap.xml","/yangin.mp4","/yangin.png"]);
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