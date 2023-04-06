import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/Task'
import { TasksController } from "../shared/TasksController";

export const api = remultExpress({
    entities: [Task],
    controllers: [TasksController],
    getUser: (req) => req.session!["user"],
})