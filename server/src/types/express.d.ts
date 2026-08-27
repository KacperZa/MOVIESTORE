import { HydratedDocument } from "mongoose";
import { IMedia } from "../model/media";
import { IUser } from "../model/user"
import { IHistory } from "../model/history";

declare global {
    namespace Express {
        interface Request {
            media?: HydratedDocument<IMedia>
            user?: HydratedDocument<IUser>
            history?: HydratedDocument<IHistory>
        }
    }
}

export {}