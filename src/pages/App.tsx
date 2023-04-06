import { FormEvent, useEffect, useState } from "react"
import { remult } from "remult"
import { Task } from "../shared/Task"
import { TasksController } from "../shared/TasksController"

const taskRepo = remult.repo(Task)

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  useEffect(() => {
    return taskRepo
      .liveQuery({
        limit: 20,
        orderBy: { completed: "asc" },
        // where: { completed: true },
      })
      .subscribe((info) => setTasks(info.applyChanges))
  }, [])
  const addTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle })
      // setTasks([...tasks, newTask])
      setNewTaskTitle("")
    } catch (error: any) {
      alert(error.message)
    }
  }
  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed)
  }
  return (
    <div>
      <h1>Todos</h1>
      <main>
        {taskRepo.metadata.apiInsertAllowed && (
          <form onSubmit={(e) => addTask(e)}>
            <input
              value={newTaskTitle}
              placeholder="What needs to be done?"
              onChange={e => setNewTaskTitle(e.target.value)}
            />
            <button>Add</button>
          </form>
        )}
        {
          tasks.map(task => {
            const setTask = (value: Task) =>
              setTasks(tasks => tasks.map(t => (t === task ? value : t)))

            const setCompleted = async (completed: boolean) =>
              // setTask(await taskRepo.save({ ...task, completed }))
              await taskRepo.save({ ...task, completed })
            const setTitle = (title: string) => setTask({ ...task, title })

            const saveTask = async () => {
              try {
                // setTask(await taskRepo.save(task))
                await taskRepo.save(task)
              } catch (error: any) {
                alert(error.message)
              }
            }

            const deleteTask = async () => {
              try {
                await taskRepo.delete(task)
                // setTasks(tasks.filter(t => t !== task))
              } catch (error: any) {
                alert(error.message)
              }
            }

            return (
              <div key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={e => setCompleted(e.target.checked)}
                />
                <input
                  value={task.title}
                  onChange={e => setTitle(e.target.value)}
                />
                <button onClick={saveTask}>Save</button>
                {taskRepo.metadata.apiDeleteAllowed && (
                  <button onClick={deleteTask}>Delete</button>

                )}
              </div>
            )
          })
        }
        <div>
          <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
          <button onClick={() => setAllCompleted(false)}>Set All Uncompleted</button>
        </div>
      </main>
    </div>
  )
}