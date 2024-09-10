// 轨迹回放功能
function lineReback(myMap, pathGj) {
    let track = new L.TrackPlayer(pathGj, {
        markerIcon: L.icon({
            iconSize: [27, 54],
            iconUrl: "./leaflet/images/car2.png",
            iconAnchor: [13.5, 27],
        }),
        speed: 800,
    });
    track.addTo(myMap);
    let controlGj = {
        speed: track.options.speed,
        progress: track.options.progress * 100,
        start: function () {
            myMap.setZoom(17, {
                animate: false,
            });
            track.start();
        },
        pause: function () {
            track.pause();
        },
        status: "original",
        carLatLng: "original",
    };
    let gui = new dat.GUI({
        width: 85,
    });

    track.on("start", () => {
        console.log("start");
        controlGj.status = "start";
    });
    track.on("pause", () => {
        console.log("pause");
        controlGj.status = "pause";
    });
    track.on("finished", () => {
        console.log("finished");
        controlGj.status = "finished";
    });
    track.on("progress", (progress, {lng, lat}, index) => {
        controlGj.carLatLng = `${lng},${lat}`;
        controlGj.progress = progress * 100;
        controlGj.status = "moving";
        console.log(`progress:${progress} - position:${lng},${lat} - trackIndex:${index}`)
    });
    gui.add(controlGj, "start")
        .name("开始");
    gui.add(controlGj, "pause")
        .name("暂停");

    let timeout = null;
    gui
        .add(controlGj, "speed", 300, 5000)
        .onChange((e) => {
            track.setSpeed(e);
        })
        .name("时速(km/h)");
    gui.add(controlGj, "status").listen()
        .name("状态");
    gui.add(controlGj, "carLatLng").listen()
        .name("当前经纬度");
    gui
        .add(controlGj, "progress", 0, 100)
        .onChange((e) => {
            track.setProgress(e / 100);
        })
        .name("所行驶里程占比")
        .listen();
}