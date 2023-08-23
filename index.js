window.onload = ()=>{
    window.dom = {
        body: document.body,
        boot: document.getElementById("boot")
    };

    var domains = window.location.host.split('.');
    window.global = {
        domains: {
            domain: domains.length > 1 ? domains[domains.length - 2] : null,
            tld: domains[domains.length - 1]
        }
    }

    dom.body.dataset.load = "ing";

    init();
}

window.onpopstate = (event)=>{
    if (event.state) {
        var state = event.state;
        console.log('onpopstate', {
            event,
            state
        });
        state.router({
            pop: true
        });
    } else {
        if (document.location) {//console.log({place});
        }
    }
    console.log(event, "location: " + document.location + ", state: " + JSON.stringify(state));
}

function init() {
    //eruda.init();
    firebase.initializeApp(auth.config);
    controller.splash.time(true);

    console.log("Initializing...");

    dom.body.dataset.load = "ed";
    dom.body.onclick = (event)=>on.touch.tap(event);

    const load = function(e) {
        const onAuthStateChanged = function(user) {
            const authChange = function(e) {
                dom.body.dataset.load = "ed";
            };
            auth.account.change(user).then(authChange);
        }
        firebase.auth().onAuthStateChanged(onAuthStateChanged);
    };

    (dom.boot.dataset.path ? dom.boot.dataset.path : window.location.pathname).router().then(load);
    console.log("Initialized");
}

/*ROUTER*/
String.prototype.router = async function(params) {
    var uri = this.toString();
    var url = new URL(uri,location.origin);
    var route = window.route = rout.e(url.pathname + url.search + url.hash);
    var go = async function(resolve, reject) {
        //console.log('String.prototype.router', route);
        if (route) {
            var pop = params ? params.pop : null;
            var path = route.path;
            window.GET = rout.ed.dir(path);

            route = window.view ? await view(route).then(rout.ed.bang(route)) : await rout.ed.bang(route);

            if (!pop && !["blob:"].includes(window.location.protocol)) {
                history.pushState(route.path, '', route.path);
            }

            resolve(route);
        } else {
            const e = {
                code: 400
            };
            reject(e);
        }
    };
    return new Promise(async(resolve,reject)=>go(resolve, reject));
}

window.rout = {};

window.rout.e = state=>{
    var arr1 = [];
    var arr2 = rout.ed.dir(state.split('#')[0].split('?')[0]);
    var page = '/';
    var path = rout.ed.url(arr2);
    const GOT = rout.ed.dir(path);
    const root = GOT[0];
    const hash = state.split('#').length > 1 ? state.split('#')[1] : null;
    const search = state.split('?').length > 1 ? state.split('?')[1].split('#')[0] : null;

    if (GOT.length > 0) {
        var n = 0;
        do {
            var m = GOT[n];
            var bool = window.rout.ing(state, GOT, n);
            arr1[n] = bool ? "*" : m;
            n++;
        } while (n < GOT.length);
        page = rout.ed.url(arr1);
    }

    const data = {
        GOT,
        hash,
        page,
        path,
        root,
        search
    };
    return data;
}

window.rout.ed = {};
window.rout.ed.bang = async(route)=>{
    var pages = dom.body.find('pages[data-pages="' + route.root + '"]');
    var page = dom.body.find('page[data-page="' + route.page + '"]');
    var vp = page ? page : pages;

    $('[data-hide]').attr("data-active", true);
    $(':not(page)[data-pages]').removeAttr("data-active");
    $(':not(page)[data-page]').removeAttr("data-active");

    if (vp && vp.closest('main')) {
        $('pages[data-pages]').removeAttr("data-active");
        $('page[data-page]').removeAttr("data-active");
    } else {
        $('body > page[data-page]').removeAttr("data-active");
        $('body > pages[data-pages]').removeAttr("data-active");
        $('body > :not(main) page[data-page]').removeAttr("data-active");
        $('body > :not(main) pages[data-pages]').removeAttr("data-active");
    }

    $('[data-hide="' + route.page + '"]').attr("data-active", false);
    $('[data-page="' + route.page + '"]').attr("data-active", true);

    var rs = $('[data-pages]');
    if (rs.length > 0) {
        var i = 0;
        do {
            route.page.includes(rs[i].dataset.pages) ? rs[i].dataset.active = true : null;
            i++;
        } while (i < rs.length)
    }
    return route;
}
window.rout.ed.dir = function(url, num, g=[]) {
    if (url) {
        var split = url.split("/");
        var it = (a,i)=>{
            i < split.length - 0 ? g[i] = a : null;
        }
        ;
        split.forEach(it);
        g[0] === "" ? g.shift() : null;
        g[g.length - 1] === "" ? g.pop() : null;
    }
    return g;
}
window.rout.ed.url = function(dir) {
    if (dir.length > 0) {
        var end = dir[dir.length - 1];
        href = dir.length === 0 ? "/" : "/" + dir.join("/") + (end.includes("?") ? "" : "/");
    } else {
        href = "/";
    }
    return href;
}

window.rout.ing = (href,GOT,n)=>{
    return false;
}

/*ON*/
window.on = {};
window.on.touch = {};
window.on["touch"]["tap"] = async(event)=>{
    var elem = target = event.target;

    elem = target.closest("[data-href]");
    if (elem) {
        var href = elem.dataset.href;
        var params = elem.dataset.params ? JSON.parse(elem.dataset.params) : null;
        href.router(params);
    }

    elem = target.closest("[data-tap]");
    if (elem) {
        var x = eval(elem.dataset.tap);
        typeof x === "function" ? x() : null;
    }
}

/*MVC*/
window.mvc = {};

window.mvc.m = model = {};

window.mvc.v = view = function(route) {
    const a = async function(resolve, reject) {
        var path = route.path;
        var get = route ? route.GOT : rout.ed.dir(dom.body.dataset.path);
        var root = get[0];
        console.log('GET', GET);

        if (root) {
            if (root === "desktop") {
                if (get[1]) {
                    if (get[1] === "apps") {
                        var app = get[2];
                        if (app) {
                            var desktop = byId('desktop');
                            var page = desktop.find('page[data-app="' + app + '"]');
                            if (page) {
                                page.dataset.mize === "mini" ? page.removeAttribute('data-mize') : null;
                            } else {
                                var template = byId('template-desktop-apps-app');
                                var html = template.content.firstElementChild;

                                var got = get;
                                got.splice(0, 3);
                                var pathname = rout.ed.url(got);

                                html.dataset.app = app;
                                html.find('text').textContent = app;
                                html.find('n').className = 'icon-' + app;
                                html.find('iframe').src = window.location.protocol + '//' + app + '.' + global.domains.domain + '.' + global.domains.tld + pathname;

                                desktop.insertAdjacentHTML('beforeend', html.outerHTML)
                            }
                        }
                        log(route);
                        resolve(route);
                    } else {
                        const e = {
                            code: 404
                        }
                        reject(e);
                    }
                } else {
                    log(route);
                    resolve(route);
                }
            } else if (root === "my") {
                log(route);
                resolve(route);
            } else {
                const e = {
                    code: 404
                }
                reject(e);
            }
        } else {
            log(route);
            resolve(route);
        }

        function log(route) {
            console.log('mvc.v log', route);
        }
    }
    return new Promise(a);
}

window.mvc.c = controller = {};

window.mvc.c.app = {};
window.mvc.c.app.maximize = function(app) {
    target.closest('page[data-app="' + app + '"]').dataset.mize = "maxi";
}

window.mvc.c.app.minimize = function(target) {
    target.closest('page').dataset.mize = "mini";
}

window.mvc.c.app.close = function(target) {
    target.closest('page').remove();
}

window.mvc.c.log = {};
window.mvc.c.log.on = function(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.find('[type="text"]').value;
    const password = form.find('[type="password"]').value;
    auth.log.on(email, password).then(function() {
        '/desktop/'.router();
    }).catch(function(error) {
        alert(error.message);
    });
}
window.mvc.c.log.off = function() {
    window.auth && auth.account.user() ? auth.log.off().then('/'.router()) : '/'.router();
}

window.mvc.c.splash = {};
window.mvc.c.splash.screen = function() {
    window.auth && auth.account.user() ? '/desktop/'.router() : '/my/'.router();
}
window.mvc.c.splash.time = function(io) {
    const today = new Date();
    let h = today.getHours();
    let hr = h > 12 ? h - 12 : h;
    let m = checkTime(today.getMinutes());
    //t s = checkTime(today.getSeconds());
    let ap = h < 12 ? "a" : "p";
    let t = hr + ":" + m;

    byId("hour").innerHTML = hr;
    byId("minute").innerHTML = m;
    //byId('second').innerHTML =  s;
    byId("a-p").innerHTML = ap;

    document.body.dataset.theme = h < 18 ? "lite" : "dark";

    setTimeout(controller.splash.time, 1000);

    function checkTime(i) {
        return (i = i < 10 ? "0" + i : i);
    }
}

/*VANILLA*/
Array.prototype.attr = function(attr, name) {
    var that = this;
    if (that.length > 1) {
        for (var i = that.length; i--; ) {
            var it = this[i];
            it ? it.setAttribute(attr, name) : null;
        }
    } else {
        that[0] ? that[0].setAttribute(attr, name) : null;
    }
    return that;
}
Array.prototype.removeAttr = function(name) {
    var that = this;
    if (that.length > 1) {
        for (var i = that.length; i--; ) {
            var it = this[i];
            it ? it.removeAttribute(name) : null;
        }
    } else {
        that[0] ? that[0].removeAttribute(name) : null;
    }
    return that;
}
Array.prototype.addClass = function(name) {
    var that = this;
    var vals = Object.values(that);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            this[i].classList.add(name);
        }
    } else {
        that[0] ? that[0].classList.add(name) : null;
    }
    return that;
}
Array.prototype.removeClass = function(name) {
    var that = this;
    var vals = Object.values(that);
    if (vals.length > 0) {
        for (var i = vals.length; i--; ) {
            this[i].classList.remove(name);
        }
    } else {
        that[0] ? that[0].classList.add(name) : null;
    }
    return that;
}
Element.prototype.find = function(elem) {
    return this.querySelector(elem);
}
window.$ = e=>{
    var obj = e;
    if (typeof obj === 'object') {
        if (NodeList.prototype.isPrototypeOf(obj)) {
            obj = Array.from(obj);
        } else {
            if (Element.prototype.isPrototypeOf(obj)) {
                obj = [obj];
            } else {
                obj = null;
            }
        }
    } else if (typeof obj === 'string') {
        var body = window.document.body;
        obj = body.querySelectorAll(obj);
        if (obj.length === 0) {
            obj = [];
        } else {
            obj = Array.from(obj);
        }
    } else {
        obj = null;
    }
    return obj;
}
window.byId = s=>{
    return document.getElementById(s);
}

/*AUTH*/
window.auth = {};

window.auth.config = {
    apiKey: "AIzaSyBxGXe52WtXo_B5iKBo9BQZSfAwYFhLRO8",
    authDomain: "uios-83649.firebaseapp.com",
    projectId: "uios-83649",
    messagingSenderId: "47824486713",
    appId: "1:47824486713:web:51f3a124b42b1080"
}

window.auth.log = {};
window.auth.log.off = function(network) {
    const c = function(resolve, reject) {
        const a = function(d) {
            dom.body.removeAttribute("data-uid");
            window.location.pathname.router();
            resolve(d);
        }
        const b = function(error) {
            reject(error);
        }
        firebase.auth().signOut().then(a).catch(b);
    }
    return new Promise(c);
}
window.auth.log.on = function(email, password) {
    const c = function(resolve, reject) {
        const a = function(e) {
            dom.body.dataset.uid = e.user.uid;
            resolve(e.user);
        };
        const b = function(error) {
            reject(error);
        };
        firebase.auth().signInWithEmailAndPassword(email, password).then(a).catch(b);
    }
    return new Promise(c);

}

window.auth.account = {};
window.auth.account.change = function(user) {
    const a = async(resolve,reject,url)=>{
        if (user) {
            dom.body.dataset.uid = user.uid;
        } else {
            dom.body.removeAttribute('data-uid');
        }
        resolve(user);
    };
    return new Promise(a);
}
window.auth.account.user = function() {
    return firebase.auth().currentUser;
}
