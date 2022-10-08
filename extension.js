const Main = imports.ui.main;
const St = imports.gi.St;
const Meta = imports.gi.Meta;
const ExtensionUtils = imports.misc.extensionUtils;

const Me = ExtensionUtils.getCurrentExtension();

let settings = null;
let monitorChangedSignal = null;
let gapSizeChangedSignal = null;
let topSizeChangedSignal = null;
let bottomSizeChangedSignal = null;
let leftSizeChangedSignal = null;
let rightSizeChangedSignal = null;
let topSwitchChangedSignal = null;
let leftSwitchChangedSignal = null;
let rightSwitchChangedSignal = null;
let bottomSwitchChangedSignal = null;

let bottomPanels = null;
let topPanels = null;
let leftPanels = null;
let rightPanels = null;

function init() {
}

function createPanels() {
    topPanels = [];
    leftPanels = [];
    rightPanels = [];
    bottomPanels = [];

    let gapSize = settings.get_int('gap-size')
    let primaryMonitor = global.display.get_primary_monitor();
    let nMonitors = global.display.get_n_monitors();
    for (let i = 0; i < nMonitors; i++) {
        let geometry = global.display.get_monitor_geometry(i);
        let geometryScale = global.display.get_monitor_scale(i);

        let topGapSize = 0;
        let leftGapSize = 0;
        let rightGapSize = 0;
        let bottomGapSize = 0;

        if (!settings.get_boolean('top-gap-primary-only') || primaryMonitor === i) {
            topGapSize = settings.get_int('top-gap-size');
        }
        if (!settings.get_boolean('left-gap-primary-only') || primaryMonitor === i) {
            leftGapSize = settings.get_int('left-gap-size');
        }
        if (!settings.get_boolean('right-gap-primary-only') || primaryMonitor === i) {
            rightGapSize = settings.get_int('right-gap-size');
        }
        if (!settings.get_boolean('bottom-gap-primary-only') || primaryMonitor === i) {
            bottomGapSize = settings.get_int('bottom-gap-size');
        }

        let topPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: (gapSize + topGapSize) * geometryScale,
            width: geometry.width,
        });

        let leftPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: geometry.height,
            width: (gapSize + leftGapSize) * geometryScale,
        });

        let rightPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: geometry.height,
            width: (gapSize + rightGapSize) * geometryScale,
        });

        let bottomPanel = new St.Bin({
            reactive: false,
            can_focus: false,
            track_hover: false,
            height: (gapSize + bottomGapSize) * geometryScale,
            width: geometry.width,
        });

        topPanel.set_position(geometry.x, 0);
        leftPanel.set_position(geometry.x, 0);
        rightPanel.set_position(geometry.x + geometry.width - rightPanel.width, 0);
        bottomPanel.set_position(geometry.x, geometry.height - bottomPanel.height);

        Main.layoutManager.addChrome(topPanel, {
            affectsInputRegion: true,
            affectsStruts: true,
        });

        Main.layoutManager.addChrome(leftPanel, {
            affectsInputRegion: true,
            affectsStruts: true,
        });

        Main.layoutManager.addChrome(rightPanel, {
            affectsInputRegion: true,
            affectsStruts: true,
        });

        Main.layoutManager.addChrome(bottomPanel, {
            affectsInputRegion: true,
            affectsStruts: true,
        });

        topPanels.push(topPanel);
        leftPanels.push(leftPanel);
        rightPanels.push(rightPanel);
        bottomPanels.push(bottomPanel);
    }
}

function enable() {
    settings = ExtensionUtils.getSettings();

    createPanels();

    monitorChangedSignal = Meta.MonitorManager.get().connect('monitors-changed', update.bind(this));

    gapSizeChangedSignal = settings.connect('changed::gap-size', update.bind(this));
    topSizeChangedSignal = settings.connect('changed::top-gap-size', update.bind(this));
    leftSizeChangedSignal = settings.connect('changed::left-gap-size', update.bind(this));
    rightSizeChangedSignal = settings.connect('changed::right-gap-size', update.bind(this));
    bottomSizeChangedSignal = settings.connect('changed::bottom-gap-size', update.bind(this));
    topSwitchChangedSignal = settings.connect('changed::top-gap-primary-only', update.bind(this));
    leftSwitchChangedSignal = settings.connect('changed::left-gap-primary-only', update.bind(this));
    rightSwitchChangedSignal = settings.connect('changed::right-gap-primary-only', update.bind(this));
    bottomSwitchChangedSignal = settings.connect('changed::bottom-gap-primary-only', update.bind(this));
}

function update() {
    removePanels();
    createPanels();
}

function removePanels() {
    for (let i = 0; i < topPanels.length; i++) {
        Main.layoutManager.removeChrome(topPanels[i]);
        Main.layoutManager.removeChrome(leftPanels[i]);
        Main.layoutManager.removeChrome(rightPanels[i]);
        Main.layoutManager.removeChrome(bottomPanels[i]);

        topPanels[i].destroy();
        leftPanels[i].destroy();
        rightPanels[i].destroy();
        bottomPanels[i].destroy();
    }

    topPanels = null;
    leftPanels = null;
    rightPanels = null;
    bottomPanels = null;
}

function disable() {
    removePanels();

    settings.disconnect(gapSizeChangedSignal);
    settings.disconnect(topSizeChangedSignal);
    settings.disconnect(leftSizeChangedSignal);
    settings.disconnect(rightSizeChangedSignal);
    settings.disconnect(bottomSizeChangedSignal);
    settings.disconnect(topSwitchChangedSignal);
    settings.disconnect(leftSwitchChangedSignal);
    settings.disconnect(rightSwitchChangedSignal);
    settings.disconnect(bottomSwitchChangedSignal);
    settings.run_dispose();

    Meta.MonitorManager.get().disconnect(monitorChangedSignal);

    gapSizeChangedSignal = null;
    topSizeChangedSignal = null;
    leftSizeChangedSignal = null;
    rightSizeChangedSignal = null;
    bottomSizeChangedSignal = null;
    topSwitchChangedSignal = null;
    leftSwitchChangedSignal = null;
    rightSwitchChangedSignal = null;
    bottomSwitchChangedSignal = null;
    monitorChangedSignal = null;
    settings = null;
}
