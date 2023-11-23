QUnit.module("TaskList", () => {
  QUnit.module("constructor", () => {
    QUnit.test(
      "throw an exception when the parameters are missing",
      (assert) => {
        assert.throws(() => {
          new TaskList();
        }, new Error("parameters are missing"));
      }
    );

    QUnit.test("throw an exception when the name isn't a string", (assert) => {
      assert.throws(() => {
        new TaskList({ name: null });
      }, new Error("the name should be a string and non-empty"));
    });

    QUnit.test(
      "throw an exception when the name is a empty string",
      (assert) => {
        assert.throws(() => {
          new TaskList({ name: "" });
        }, new Error("the name should be a string and non-empty"));
      }
    );
  });

  QUnit.module("getName", () => {
    QUnit.test("get name", (assert) => {
      let props = { name: "twoTask" };
      let tk = new TaskList(props);
      assert.equal(tk.name, props.name, "get name");
    });
  });

  QUnit.module("setName", () => {
    QUnit.test("set name", (assert) => {
      let props = { name: "oneTask" };
      let tk = new TaskList(props);
      tk.name = "oneOneTask";
      assert.equal(tk.name, "oneOneTask", "set name");
    });
  });

  QUnit.module("getId", () => {
    QUnit.test("get id", (assert) => {
      let tk = new TaskList({ name: "oneTask" });
      let tk2 = new TaskList({ name: "oneTwoTask" });
      assert.ok(tk2.getId() > tk.getId());
    });
  });

  QUnit.module("getTasks", () => {
    QUnit.test("get list of task", (assert) => {
      let tk = new Task({
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      });
      let tl = new TaskList({ name: "Ruby" });
      tl.addTask(tk);
      assert.equal(tl.getTasks()[0], tk, "get list of task");
    });
  });

  QUnit.module("addTask", () => {
    QUnit.test(
      "throws an exception when the object isn't a instance of task",
      (assert) => {
        assert.throws(() => {
          let tl = new TaskList({ name: "toTaskList" });
          tl.addTask(1);
        }, new Error("you try to add a task which don't exist"));
      }
    );

    QUnit.test("add task", (assert) => {
      let props = { name: "firstTaskList" };
      let tk = new Task({
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      });
      let tk2 = new Task({
        name: "oneOneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      });
      let tl = new TaskList(props);
      tl.addTask(tk);
      tl.addTask(tk2);
      assert.ok(tl.getTasks().length == 2);
    });
  });

  QUnit.module("removeTask", () => {
    QUnit.test("throws an exception when a task doesn't exist", (assert) => {
      assert.throws(() => {
        let tl = new TaskList({ name: "toTaskList" });
        tl.removeTask(1);
      }, new Error("you are trying to remove a task that does not exist"));
    });

    QUnit.test(
      "throws an exception when a task has a status done",
      (assert) => {
        assert.throws(() => {
          let props = { name: "firstTaskList" };
          let props2 = {
            name: "oneTask",
            priority: "average",
            dueDate: "",
            status: "todo",
          };
          let tk = new Task(props2);
          let tl = new TaskList(props);
          tk.status = "in_progress";
          tk.status = "done";
          tl.addTask(tk);
          tl.removeTask(0);
        }, new Error("you try to delete a task with status done"));
      }
    );

    QUnit.test("remove task", (assert) => {
      let props = { name: "firstTaskList" };
      let tk = new Task({
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      });
      let tk2 = new Task({
        name: "oneOneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      });
      let tl = new TaskList(props);
      tl.addTask(tk);
      tl.addTask(tk2);
      tl.removeTask(1);
      tl.removeTask(0);
      assert.ok(tl.getTasks().length == 0);
    });
  });

  QUnit.module("sort task by due date", () => {
    QUnit.test(
      "verify the position of task in array of taskList after sort by due date when we have the same due date",
      (assert) => {
        let tk = new Task({
          name: "oneTask",
          priority: "low",
          dueDate: "",
          status: "todo",
        });

        let tk1 = new Task({
          name: "twoTask",
          priority: "low",
          dueDate: "",
          status: "todo",
        });

        let props = { name: "twoTask" };
        let lt = new TaskList(props);

        lt.addTask(tk);
        lt.addTask(tk1);
        assert.equal(lt.getTasks()[0].name, "oneTask", "sort by due date");
      }
    );

    QUnit.test(
      "verify the position of task in array of taskList after sort by due date",
      (assert) => {
        let tk = new Task({
          name: "oneTask",
          priority: "high",
          dueDate: "",
          status: "todo",
        });

        let tk1 = new Task({
          name: "twoTask",
          priority: "low",
          dueDate: "12/11/2025",
          status: "todo",
        });

        let tk2 = new Task({
          name: "threeTask",
          priority: "average",
          dueDate: "11/12/2024",
          status: "todo",
        });

        let props = { name: "twoTask" };
        let lt = new TaskList(props);
        lt.addTask(tk);
        lt.addTask(tk1);
        lt.addTask(tk2);
        assert.equal(
          lt.getTasks()[0].name,
          "oneTask",
          "sort array by due date"
        );
      }
    );

    QUnit.test(
      "verify the position of task in array of taskList after sort by due date",
      (assert) => {
        let tk = new Task({
          name: "oneTask",
          priority: "high",
          dueDate: "",
          status: "todo",
        });

        let tk1 = new Task({
          name: "twoTask",
          priority: "low",
          dueDate: "12/11/2025",
          status: "todo",
        });

        let tk2 = new Task({
          name: "threeTask",
          priority: "average",
          dueDate: "11/12/2024",
          status: "todo",
        });

        let props = { name: "twoTask" };
        let lt = new TaskList(props);
        lt.addTask(tk);
        lt.addTask(tk1);
        lt.addTask(tk2);
        assert.equal(
          lt.getTasks()[1].name,
          "threeTask",
          "sort array by due date"
        );
      }
    );

    QUnit.test(
      "verify the position of task in array of taskList after sort by due date",
      (assert) => {
        let tk = new Task({
          name: "oneTask",
          priority: "high",
          dueDate: "",
          status: "todo",
        });

        let tk1 = new Task({
          name: "twoTask",
          priority: "low",
          dueDate: "12/11/2025",
          status: "todo",
        });

        let tk2 = new Task({
          name: "threeTask",
          priority: "average",
          dueDate: "11/12/2024",
          status: "todo",
        });

        let props = { name: "twoTask" };
        let lt = new TaskList(props);
        lt.addTask(tk);
        lt.addTask(tk1);
        lt.addTask(tk2);
        assert.equal(
          lt.getTasks()[2].name,
          "twoTask",
          "sort array by due date"
        );
      }
    );
  });

  QUnit.module("sort by priority", () => {
    QUnit.test(
      "sort array of task when we have the same priority",
      (assert) => {
        let tk = new Task({
          name: "oneTask",
          priority: "low",
          dueDate: "",
          status: "todo",
        });

        let tk1 = new Task({
          name: "twoTask",
          priority: "low",
          dueDate: "12/11/2025",
          status: "todo",
        });

        let props = { name: "twoTask" };
        let lt = new TaskList(props);

        lt.addTask(tk);
        lt.addTask(tk1);
        lt.sortTaskByPriorty();
        assert.equal(lt.getTasks()[0].name, "oneTask", "sort by priority");
      }
    );

    QUnit.test(
      "sort array of task by priority high, average, low",
      (assert) => {
        let tk = new Task({
          name: "oneTask",
          priority: "low",
          dueDate: "",
          status: "todo",
        });

        let tk1 = new Task({
          name: "twoTask",
          priority: "high",
          dueDate: "12/11/2025",
          status: "todo",
        });

        let props = { name: "twoTask" };
        let lt = new TaskList(props);

        lt.addTask(tk);
        lt.addTask(tk1);
        lt.sortTaskByPriorty();
        assert.equal(lt.getTasks()[0].name, "twoTask", "sort by priority");
      }
    );
  });
});
