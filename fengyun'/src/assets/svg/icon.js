! function (c) {
  var e, a = '<svg><symbol id="icon-positionRight" viewBox="0 0 1024 1024"><path d="M597.354637 1023.861952h-42.948302v-1022.578616h42.948302z"  ></path><path d="M783.581542 493.562908v31.188647h-451.468459v-31.188647zM594.818642 992.811352v31.188648h-193.778648v-31.188648zM597.58983 0.950998v31.188648h-193.778648v-31.188648z"  ></path></symbol><symbol id="icon-positionLeft" viewBox="0 0 1024 1024"><path d="M518.648919 1.022911h42.962245v1022.9106h-42.962245z"  ></path><path d="M783.669712 493.723145v31.198773h-451.61503v-31.198773zM714.34706 992.806341v31.198774h-193.841558v-31.198774zM712.337041 1.309326v31.198773h-193.841559v-31.198773z"  ></path></symbol></svg>',
    t = (e = document.getElementsByTagName("script"))[e.length - 1].getAttribute("data-injectcss");
  if (t && !c.__iconfont__svg__cssinject__) {
    c.__iconfont__svg__cssinject__ = !0;
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
    } catch (e) {
      console && console.log(e)
    }
  }! function (e) {
    if (document.addEventListener)
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) setTimeout(e, 0);
      else {
        var t = function () {
          document.removeEventListener("DOMContentLoaded", t, !1), e()
        };
        document.addEventListener("DOMContentLoaded", t, !1)
      }
    else document.attachEvent && (n = e, o = c.document, i = !1, d = function () {
      i || (i = !0, n())
    }, (a = function () {
      try {
        o.documentElement.doScroll("left")
      } catch (e) {
        return void setTimeout(a, 50)
      }
      d()
    })(), o.onreadystatechange = function () {
      "complete" == o.readyState && (o.onreadystatechange = null, d())
    });
    var n, o, i, d, a
  }(function () {
    var e, t, n, o, i, d;
    (e = document.createElement("div")).innerHTML = a, a = null, (t = e.getElementsByTagName("svg")[0]) && (t.setAttribute("aria-hidden", "true"), t.style.position = "absolute", t.style.width = 0, t.style.height = 0, t.style.overflow = "hidden", n = t, (o = document.body).firstChild ? (i = n, (d = o.firstChild).parentNode.insertBefore(i, d)) : o.appendChild(n))
  })
}(window);
