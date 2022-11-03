window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("autoreload")) {
        const script = document.createElement("script");
        script.src = "https://livejs.com/live.js";
        document.head.appendChild(script);
    }
}
