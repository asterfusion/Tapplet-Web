/*****
 * dashboard global setting
 */
const _FRABIC_MODE = "$_fr_s";
const DEFAULT_FRABIC_MODE = "af";
const FRABIC_MODE = _FRABIC_MODE.length == 6 ? DEFAULT_FRABIC_MODE : _FRABIC_MODE;
const SHORT_NAME = FRABIC_MODE == "af" ? "Asteria" : "Terastar";

const _DEVICE_TRANSFORM = "$_fr_t";
const DEVICE_TRANSFORM = _DEVICE_TRANSFORM.length == 6 ? {
    "PF6648": "PX306P-48S"
} : JSON.parse(_DEVICE_TRANSFORM);

const _SUPPORT_DEVICES = "$_fr_d";
const _DEFAULT_SUPPORT_DEVICES = [
    "PF9032",
    "PF6648",
    "PF3048L",
    "SF8212",
    "SF8424",
    "SF3028",
    "SF3040",
    "SF3040D",
    "SF3048",
    "SF3048D",
    "SF3248",
    "SF3248D",
    "Server",
    "PX306P-48S",
    "PX306P-48T",
    "PX306P-48Y",
    "PX532P",
    "PX532R"
];
let SUPPORT_DEVICES = _SUPPORT_DEVICES.length == 6 ? _DEFAULT_SUPPORT_DEVICES : JSON.parse(_SUPPORT_DEVICES);

for(let key in DEVICE_TRANSFORM) {
    let idx = SUPPORT_DEVICES.indexOf(key);
    SUPPORT_DEVICES.splice(idx, 1)
}

let _exportconfig = {
    "name": "Controller",
    "frabic_mode": FRABIC_MODE,
    "short_name": SHORT_NAME,
    "title": `${SHORT_NAME} Controller`,
    "coporight": `Copyright©${SHORT_NAME} Technologies`,
    "support_devices": SUPPORT_DEVICES,
    "devices_transform": DEVICE_TRANSFORM,
    "device_type_check": "loose",
    "table_size": "middle",
    "table_page_size_options": ["10", "20", "50", "100"],
    "table_default_page_size": 20
}

let _idxofserver = _exportconfig.support_devices.indexOf("Server");
let _devicetypes = FRABIC_MODE == "af" ?
    _exportconfig.support_devices.slice(_idxofserver + 1) :
    _exportconfig.support_devices.slice(0, _idxofserver);
_exportconfig.show_devices = _exportconfig.support_devices;//_devicetypes.concat(["Server"]);

module.exports = _exportconfig