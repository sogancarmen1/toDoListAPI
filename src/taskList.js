class TaskList {
  static #id = 0;
  #name = "undefined";
  constructor(props) {
    this.id = TaskList.#id++;
    this.tasks = [];
    if (props == undefined) throw new Error("parameters are missing");
    if (props && (typeof props.name != "string" || props.name == ""))
      throw new Error("the name should be a string and non-empty");

    this.#name = props.name;
  }

  get name() {
    return this.#name;
  }

  getId() {
    return this.id;
  }

  getTasks() {
    return this.tasks;
  }

  set name(value) {
    if (typeof value != "string" || value == "")
      throw new Error("the name should be a string and non-empty");
    this.#name = value;
  }

  addTask(task) {
    if (!(task instanceof Task))
      throw new Error("you try to add a task which don't exist");
    this.tasks.push(task);
    if (this.tasks.length >= 2) this.sortTaskByDueDate();
  }

  removeTask(indexOfTask) {
    if (!this.tasks.includes(this.tasks[indexOfTask]))
      throw new Error("you are trying to remove a task that does not exist");
    if (this.getTasks()[0].status == "done")
      throw new Error("you try to delete a task with status done");
    this.tasks.splice(indexOfTask, 1);
  }

  sortTaskByDueDate() {
    this.tasks.sort((taskA, taskB) => {
      const dateA = new Date(taskA.dueDate);
      const dateB = new Date(taskB.dueDate);
      return dateA - dateB;
    });
  }

  sortTaskByPriorty() {
    const orderPriority = { high: 0, average: 1, low: 2 };
    this.tasks.sort((a, b) => {
      return orderPriority[a.priority] - orderPriority[b.priority];
    });
  }
}
