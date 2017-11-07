"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./util/api");
const apps_1 = require("./resource/apps");
const monitoring_1 = require("./resource/monitoring");
const package_1 = require("./resource/package");
const snapshot_1 = require("./resource/snapshot");
const sourcemaps_1 = require("./resource/sourcemaps");
const user_1 = require("./resource/user");
class ProClient {
    constructor(cfg) {
        this.user = null;
        // Set config from env
        this.env = {
            debug: false,
            host: "https://api.ionicjs.com"
        };
        if (cfg) {
            if (cfg.debug) {
                this.env.debug = cfg.debug;
            }
            if (cfg.host) {
                this.env.host = cfg.host;
            }
        }
        // Instantiate API
        this.api = new api_1.Api(this.env);
        // Instantiate base resources
        var apps = new apps_1.AppsResource(this.api);
        var user = new user_1.UserResource(this.api);
        var monitoring = new monitoring_1.MonitoringResource(this.api);
        // Instantiate subresources
        var snapshots = new snapshot_1.SnapshotsResource(apps);
        var packages = new package_1.PackageResource(apps);
        var sourcemaps = new sourcemaps_1.SourceMapResource(monitoring);
        // Set resources on client
        this.resource = {
            apps,
            monitoring,
            packages,
            snapshots,
            sourcemaps,
            user
        };
    }
    getUserToken() {
        return this.api.getToken();
    }
    setUserToken(token) {
        this.api.setToken(token);
    }
    login(email, password) {
        return new Promise((resolve, reject) => {
            this.api.post('/login', {
                email: email,
                password: password,
                source: 'api'
            }).then((res) => {
                this.user = res.data.user;
                this.api.setToken(res.data.token);
                resolve(this.user);
            }, (err) => {
                //console.log()
                console.error("Login error:", err.error.message || "Unknown");
                reject(err.error);
            });
        });
    }
}
exports.ProClient = ProClient;
