import { Environment } from './environment';
import { AppsResource } from './resource/apps';
import { SnapshotsResource } from './resource/snapshot';
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
}
export declare class ProClient {
    private api;
    env: Environment;
    resource: ClientResources;
    user: ProUser;
    constructor(cfg?: Environment);
    login(email: string, password: string): Promise<ProUser>;
}