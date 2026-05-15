
(function () {
  "use strict";

  var STORAGE_KEY = "ua_session_id";

  function currentScript() {
    return document.currentScript;
  }

  function getEndpoint() {
    var script = currentScript();
    if (script && script.getAttribute("data-endpoint")) {
      return script.getAttribute("data-endpoint");
    }
    var scripts = document.getElementsByTagName("script");
    var i;
    for (i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      var ep = s.getAttribute("data-endpoint");
      if (!ep) continue;
      var src = s.getAttribute("src") || "";
      if (src.indexOf("tracker.js") !== -1) return ep;
    }
    if (typeof window.__UA_TRACKER_ENDPOINT__ === "string" && window.__UA_TRACKER_ENDPOINT__) {
      return window.__UA_TRACKER_ENDPOINT__;
    }
    return "";
  }

  var resolvedEndpoint = null;
  function endpoint() {
    if (resolvedEndpoint !== null) return resolvedEndpoint;
    resolvedEndpoint = getEndpoint();
    return resolvedEndpoint;
  }

  function getOrCreateSessionId() {
    try {
      var existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) return existing;
      var id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "s_" + String(Date.now()) + "_" + String(Math.random()).slice(2, 12);
      window.localStorage.setItem(STORAGE_KEY, id);
      return id;
    } catch (e) {
      return "sess_" + String(Date.now()) + "_" + String(Math.random()).slice(2, 10);
    }
  }

  function buildPayload(type, clickX, clickY) {
    var payload = {
      session_id: getOrCreateSessionId(),
      type: type,
      page_url: String(window.location.href),
      timestamp: Date.now(),
    };
    if (type === "click" && typeof clickX === "number" && typeof clickY === "number") {
      payload.click_x = clickX;
      payload.click_y = clickY;
    }
    return payload;
  }

  function postJson(url, bodyObj) {
    var body = JSON.stringify(bodyObj);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true,
      mode: "cors",
    });
  }

  function track(type, clickX, clickY) {
    var url = endpoint();
    if (!url) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[ua-tracker] Missing endpoint. Set data-endpoint on the script tag or window.__UA_TRACKER_ENDPOINT__.");
      }
      return;
    }
    var payload = buildPayload(type, clickX, clickY);
    postJson(url, payload).catch(function () {
      /* ignore network errors for demo / fire-and-forget */
    });
  }

  function onPageView() {
    track("page_view");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onPageView);
  } else {
    onPageView();
  }

  document.addEventListener(
    "click",
    function (ev) {
      if (typeof ev.clientX !== "number" || typeof ev.clientY !== "number") return;
      track("click", ev.clientX, ev.clientY);
    },
    true
  );
})();
