import { OnModuleInit } from "@nestjs/common";
import next, { NextServer } from "next/dist/server/next";

export class ViewService implements OnModuleInit {
    private server: NextServer;

    async onModuleInit() {
        try {
            this.server = next({dev: true, dir: './src/client'});
            await this.server.prepare();
        } catch (error) {
            console.log(error);
        }
    }

    
    public get nextServer() : NextServer {
        return this.server;
    }
    
}