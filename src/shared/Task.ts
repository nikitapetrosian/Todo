import { Allow, Entity, Fields } from "remult"

@Entity("tasks", {
    allowApiCrud: Allow.authenticated,
    allowApiDelete: "admin",
    allowApiInsert: "admin",
})
export class Task {
    @Fields.autoIncrement()
    id = 0;
    @Fields.string<Task>({
        validate: (task) => {
            if (task.title.length < 3) throw Error("Too Short")
        },
    })
    title = "";
    @Fields.boolean()
    completed = false;
}
