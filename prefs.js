const {Gio, Gtk} = imports.gi;

const Gettext = imports.gettext.domain('gnome-edge-gap');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let settings;
let builder;

function init() {
    settings = ExtensionUtils.getSettings();
    ExtensionUtils.initTranslations("gnome-edge-gap");
    builder = new Gtk.Builder();
}

function buildPrefsWidget() {
    const isGtk4 = Gtk.get_major_version() >= '4';

    let frame = new Gtk.ScrolledWindow({
        hscrollbar_policy: Gtk.PolicyType.NEVER,
        min_content_height: 400
    });
    builder.set_translation_domain("gnome-edge-gap");
    builder.add_from_file(Me.path + '/prefs.xml');

    let notebook = builder.get_object("settings_notebook");
    if (isGtk4) {
        frame.set_child(notebook);
    } else {
        frame.add(notebook);
    }

    bindSpinButtonSetting('spin_gap_size', 'gap-size');
    bindSpinButtonSetting('spin_top_gap_size', 'top-gap-size');
    bindSpinButtonSetting('spin_left_gap_size', 'left-gap-size');
    bindSpinButtonSetting('spin_right_gap_size', 'right-gap-size');
    bindSpinButtonSetting('spin_bottom_gap_size', 'bottom-gap-size');

    bindSwitchSetting('switch_top_primary_only', 'top-gap-primary-only');
    bindSwitchSetting('switch_left_primary_only', 'left-gap-primary-only');
    bindSwitchSetting('switch_right_primary_only', 'right-gap-primary-only');
    bindSwitchSetting('switch_bottom_primary_only', 'bottom-gap-primary-only');

    if (!isGtk4) {
        frame.show_all();
    }
    return frame;
}

function bindSpinButtonSetting(objectName, settingName) {
    let gtkSpinButton = builder.get_object(objectName);
    gtkSpinButton.set_value(settings.get_value(settingName));
    settings.bind(settingName, gtkSpinButton, 'value',Gio.SettingsBindFlags.DEFAULT);
}

function bindSwitchSetting(objectName, settingName) {
    let gtkSwitch = builder.get_object(objectName);
    gtkSwitch.set_active(settings.get_boolean(settingName));
    settings.bind(settingName, gtkSwitch, 'active',Gio.SettingsBindFlags.DEFAULT);
}
