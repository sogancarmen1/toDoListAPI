QUnit.module("Task", () => {
  QUnit.module("constructor", () => {
    QUnit.test(
      "throws an exception when no parameters are precised",
      (assert) => {
        assert.throws(() => {
          new Task();
        }, new Error("parameters are missing"));
      }
    );

    QUnit.test(
      "throws an exception when name attribute is empty string",
      (assert) => {
        assert.throws(() => {
          new Task({ name: "" });
        }, new Error("name attribute should be a non-empty string"));
      }
    );

    QUnit.test(
      "throws an exception when name attribute is not string",
      (assert) => {
        assert.throws(() => {
          new Task({ name: null });
        }, new Error("name attribute should be a non-empty string"));
      }
    );

    QUnit.test("throws an exception when priority isn't a string", (assert) => {
      assert.throws(() => {
        new Task({ name: "salut", priority: null });
      }, new Error("priority should be precise (high, average, low)"));
    });

    QUnit.test(
      "throws an exception when priority isn't high, low, average",
      (assert) => {
        assert.throws(() => {
          new Task({ name: "play game", priority: "none" });
        }, new Error("priority should be precise (high, average, low)"));
      }
    );

    QUnit.test(
      "throws an exception when the date entered isn't a date",
      (assert) => {
        assert.throws(() => {
          new Task({ name: "firstTask", priority: "high", dueDate: undefined });
        }, new Error("date should be in dd/mm/yyyy format"));
      }
    );

    QUnit.test(
      "throws an exception when the date entered isn't a format date",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "12-16-1980",
          });
        }, new Error("date should be in dd/mm/yyyy format"));
      }
    );

    QUnit.test(
      "throws an exception when the year is less than the current year",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "25/12/1980",
          });
        }, new Error("the year must not be less than the current year"));
      }
    );

    QUnit.test(
      "throws an exception when the month is less than the current month",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "25/09/2023",
          });
        }, new Error("the month must not be less than the current month"));
      }
    );

    QUnit.test(
      "throws an exception when the day is less than the current day",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "12/11/2023",
          });
        }, new Error("the day must not be less than the current day"));
      }
    );

    QUnit.test("throws an exception when the month is incorrect", (assert) => {
      assert.throws(() => {
        new Task({
          name: "firstTask",
          priority: "high",
          dueDate: "25/16/2025",
        });
      }, new Error("the month should be between 0 and 12"));
    });

    QUnit.test(
      "throws an exception when the day is incorrect (bissectile)",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "30/02/2028",
          });
        }, new Error("the day should'nt execeed 29"));
      }
    );

    QUnit.test(
      "throws an exception when the day is incorrect (bissectile, not february)",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "32/03/2028",
          });
        }, new Error("the day should'nt execeed 31"));
      }
    );

    QUnit.test(
      "throws an exception when the day is incorrect (non bissectile)",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "30/02/2027",
          });
        }, new Error("the day should'nt execeed 28"));
      }
    );

    QUnit.test(
      "throws an exception when the day is incorrect (non bissectile, not february)",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "32/03/2027",
          });
        }, new Error("the day should'nt execeed 31"));
      }
    );

    QUnit.test("any task create is a status todo by default", (assert) => {
      let props = {
        priority: "low",
        dueDate: "12/10/2024",
        status: "in_progress",
        name: "oneTask",
      };
      let tk = new Task(props);
      assert.equal(tk.status, "todo", "status todo by default");
    });

    QUnit.test(
      "throws an exception when the status isn't a todo, in_progress, done, canceled  or waiting",
      (assert) => {
        assert.throws(() => {
          new Task({
            name: "firstTask",
            priority: "high",
            dueDate: "12/20/1998",
            status: "",
          });
        }, new Error("status should be precise"));
      }
    );
  });

  QUnit.module("getName", () => {
    QUnit.test("return a correct name", (assert) => {
      let props = {
        priority: "high",
        dueDate: "12/10/2024",
        status: "todo",
        name: "twoTask",
      };
      let tk = new Task(props);
      assert.equal(tk.name, props.name, "get name");
    });
  });

  QUnit.module("getPriority", () => {
    QUnit.test("get priority", (assert) => {
      let props = {
        priority: "low",
        dueDate: "12/10/2024",
        status: "in_progress",
        name: "oneTask",
      };
      let tk = new Task(props);
      assert.equal(tk.priority, props.priority, "get priority");
    });
  });

  QUnit.module("getDueDate", () => {
    QUnit.test("get dueDate (default date)", (assert) => {
      let props = {
        name: "firstTask",
        priority: "high",
        dueDate: "",
        status: "done",
      };
      let tk = new Task(props);
      assert.equal(tk.dueDate, completeDate, "get dueDate");
    });
  });

  QUnit.module("getStatus", () => {
    QUnit.test("get status, status has todo  by default", (assert) => {
      let props = {
        name: "oneTask",
        priority: "average",
        dueDate: "",
      };
      let tk = new Task(props);
      assert.equal(tk.status, "todo", "get status");
    });
  });

  QUnit.module("isMoveCurrentSatutsToNextStatus", () => {
    QUnit.module(
      "test when status pass todo => todo ou in_progress ou waiting ou canceled ou done",
      () => {
        QUnit.test("return false when status pass (todo => todo)", (assert) => {
          let props = {
            priority: "low",
            dueDate: "12/10/2024",
            status: "todo",
            name: "oneTask",
          };
          let tk = new Task(props);
          let result = tk.isMoveCurrentSatutsToNextStatus(tk.status, "todo");
          assert.ok(result == false, "return a correct boolean");
        });

        QUnit.test(
          "return true when status pass (todo => in_progress)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "in_progress"
            );
            assert.ok(result == true, "return a correct boolean");
          }
        );

        QUnit.test(
          "return false when status pass (todo => waiting)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "waiting"
            );
            assert.ok(result == false, "return a correct boolean");
          }
        );

        QUnit.test("return false when status pass (todo => done)", (assert) => {
          let props = {
            priority: "low",
            dueDate: "12/10/2024",
            status: "todo",
            name: "oneTask",
          };
          let tk = new Task(props);
          let result = tk.isMoveCurrentSatutsToNextStatus(tk.status, "done");
          assert.ok(result == false, "return a correct boolean");
        });

        QUnit.test(
          "return true when status pass (todo => canceled)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "canceled") == true,
              "return a correct boolean"
            );
          }
        );
      }
    );

    QUnit.module(
      "test when status pass in_progress => in_progress ou todo ou waiting ou done ou canceled",
      () => {
        QUnit.test(
          "return false when status pass (in_progress => in_progress)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "in_progress"
            );
            assert.ok(result == false, "return a correct boolean");
          }
        );

        QUnit.test(
          "return false when status pass (in_progress => todo)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            let result = tk.isMoveCurrentSatutsToNextStatus(tk.status, "todo");
            assert.ok(result == false, "return a correct boolean");
          }
        );

        QUnit.test(
          "return true when status pass (in_progress => waiting)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "waiting"
            );
            assert.ok(result == true, "return a correct boolean");
          }
        );

        QUnit.test(
          "return true when status pass (in_progress => done)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            //tk.status = "done";
            let result = tk.isMoveCurrentSatutsToNextStatus(tk.status, "done");
            assert.ok(result == true, "return a correct boolean");
          }
        );

        QUnit.test(
          "return true when status pass (in_progress => canceled)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            //tk.status = "done";
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "canceled"
            );
            assert.ok(result == true, "return a correct boolean");
          }
        );
      }
    );

    QUnit.module(
      "test when status pass waiting => waiting ou todo ou in_progress ou done ou canceled",
      () => {
        QUnit.test(
          "return false when status pass (waiting => waiting)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "waiting"
            );
            assert.ok(result == false, "return a correct boolean");
          }
        );

        QUnit.test(
          "return false when status pass (waiting => todo)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            let result = tk.isMoveCurrentSatutsToNextStatus(tk.status, "todo");
            assert.ok(result == false, "return a correct boolean");
          }
        );

        QUnit.test(
          "return true when status pass (waiting => in_progress)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            let result = tk.isMoveCurrentSatutsToNextStatus(
              tk.status,
              "in_progress"
            );
            assert.ok(result == true, "return a correct boolean");
          }
        );

        QUnit.test(
          "return true when status pass (waiting => done)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "done") == true,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return true when status pass (waiting => canceled)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "canceled") == true,
              "return a correct boolean"
            );
          }
        );
      }
    );

    QUnit.module(
      "test when status pass done => done ou todo ou in_progress ou waiting ou canceled",
      () => {
        QUnit.test("return false when status pass (done => done)", (assert) => {
          let props = {
            priority: "low",
            dueDate: "12/10/2024",
            status: "todo",
            name: "oneTask",
          };
          let tk = new Task(props);
          tk.status = "in_progress";
          tk.status = "waiting";
          tk.status = "done";
          assert.ok(
            tk.isMoveCurrentSatutsToNextStatus(tk.status, "done") == false,
            "return a correct boolean"
          );
        });

        QUnit.test("return false when status pass (done => todo)", (assert) => {
          let props = {
            priority: "low",
            dueDate: "12/10/2024",
            status: "todo",
            name: "done",
          };
          let tk = new Task(props);
          tk.status = "in_progress";
          tk.status = "waiting";
          tk.status = "done";
          assert.ok(
            tk.isMoveCurrentSatutsToNextStatus(tk.status, "todo") == false,
            "return a correct boolean"
          );
        });

        QUnit.test(
          "return false when status pass (done => in_progress)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "done",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            tk.status = "done";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "in_progress") ==
                false,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return false when status pass (done => waiting)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "done",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            tk.status = "done";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "waiting") == false,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return false when status pass (done => canceled)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "in_progress";
            tk.status = "waiting";
            tk.status = "done";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "canceled") ==
                false,
              "return a correct boolean"
            );
          }
        );
      }
    );

    QUnit.module(
      "test when status pass canceled => canceled ou todo ou done ou in_progress ou waiting",
      () => {
        QUnit.test(
          "return false when status pass (canceled => canceled)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "canceled";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "canceled") ==
                false,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return true when status pass (canceled => todo)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "canceled";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "todo") == true,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return true when status pass (canceled => in_progress)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "todo",
              name: "oneTask",
            };
            let tk = new Task(props);
            tk.status = "canceled";
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "in_progress") ==
                false,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return true when status pass (canceled => waiting)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "canceled",
              name: "oneTask",
            };
            let tk = new Task(props);
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "waiting") == false,
              "return a correct boolean"
            );
          }
        );

        QUnit.test(
          "return false when status pass (canceled => done)",
          (assert) => {
            let props = {
              priority: "low",
              dueDate: "12/10/2024",
              status: "canceled",
              name: "oneTask",
            };
            let tk = new Task(props);
            assert.ok(
              tk.isMoveCurrentSatutsToNextStatus(tk.status, "done") == false,
              "return a correct boolean"
            );
          }
        );
      }
    );
  });

  QUnit.module("setStatus", () => {
    QUnit.test(
      "throws an exception when you don't pass next status",
      (assert) => {
        assert.throws(() => {
          let tk = new Task({
            name: "firstTask",
            priority: "high",
            status: "todo",
            dueDate: "12/12/2025",
          });
          tk.status = "in_progress";
          tk.status = "todo";
        }, new Error("you don't pass this status to status specified"));
      }
    );

    QUnit.test("set status", (assert) => {
      let props = {
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "todo",
      };
      let tk = new Task(props);
      tk.status = "in_progress";
      assert.equal(tk.status, "in_progress", "set status");
    });
  });

  QUnit.module("setName", () => {
    QUnit.test("set name", (assert) => {
      let props = {
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      };
      let tk = new Task(props);
      tk.name = "oneOneTask";
      assert.equal(tk.name, "oneOneTask", "set name");
    });
  });

  QUnit.module("setPriority", () => {
    QUnit.test("set priority", (assert) => {
      let props = {
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      };
      let tk = new Task(props);
      tk.priority = "high";
      assert.equal(tk.priority, "high", "set name");
    });
  });

  QUnit.module("setDueDate", () => {
    QUnit.test("set due date", (assert) => {
      let props = {
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      };
      let tk = new Task(props);
      tk.dueDate = "12/12/2025";
      assert.equal(tk.dueDate, "12/12/2025", "set due date");
    });
  });

  QUnit.module("getId", () => {
    QUnit.test("get id", (assert) => {
      let tk = new Task({
        name: "oneTask",
        priority: "average",
        dueDate: "",
        status: "in_progress",
      });
      let tk2 = new Task({
        name: "oneTwoTask",
        priority: "average",
        dueDate: "",
        status: "todo",
      });
      assert.ok(tk2.getId() > tk.getId());
    });
  });
});
