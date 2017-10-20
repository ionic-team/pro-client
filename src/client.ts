import { ApiResponse, Api } from './util/api';
import { Environment } from './environment';
import { AppsResource } from './resource/apps';
import { PackageResource } from './resource/package';
import { SnapshotsResource } from './resource/snapshot';
import { UserResource } from './resource/user';

export interface ProUser {
  email: string;
  id: number;
  name: string;
  orgs: any;
  teams: any;
}

export interface ClientResources {
  apps: AppsResource;
  snapshots: SnapshotsResource;
  packages: PackageResource;
  user: UserResource;
}

export class ProClient {
  private api: Api;
  env: Environment;
  resource: ClientResources;
  user: ProUser = null;

  constructor(cfg?: Environment) {
    // Set config from env
    this.env = {
      debug: false,
      host: "https://api.ionicjs.com"
    }
    if (cfg) {
      if (cfg.debug) {
        this.env.debug = cfg.debug;
      } 
      if (cfg.host) {
        this.env.host = cfg.host;
      }
    }

    // Instantiate API
    this.api = new Api(this.env);

    // Instantiate base resources
    var apps = new AppsResource(this.api);

    // Instantiate subresources
    var snapshots = new SnapshotsResource(apps);

    // Set resources on client
    this.resource = {
      apps: apps,
      snapshots: snapshots,
      packages: new PackageResource(this.api),
      user: new UserResource(this.api)
    }
  }

  login(email: string, password: string): Promise<ProUser>  {
    return new Promise((resolve, reject) => {
      this.api.post('/login', {
        email: email,
        password: password,
        source: 'api'
      }).then((res: ApiResponse) => {
        this.user = res.data.user;
        this.api.apiToken = res.data.token;
        console.log("Logged in user:", this.user.name);
        resolve(this.user);
      }, (err: ApiResponse) => {
        console.error("Login error:", err.error.message || "Unknown");
        reject(err.error);
      });
    });
  }

}