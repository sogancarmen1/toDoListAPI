const priority_type = ["high", "average", "low"];

const status_type = ["todo", "in_progress", "waiting", "done", "canceled"];

const dateOfDay = new Date();
const year = dateOfDay.getFullYear();
const month = dateOfDay.getMonth() + 1;
const day = dateOfDay.getDate();
const completeDate = `${day}/${month}/${year}`;
const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

class Task {
  static #id = 0;
  #name = "undefined";
  #priority = "undefined";
  #dueDate = "undefined";
  #status = "undefined";
  constructor(props, statusDefault = "todo") {
    if (props == undefined) throw new Error("parameters are missing");
    if (props && (typeof props.name != "string" || props.name == ""))
      throw new Error("name attribute should be a non-empty string");
    if (props && !priority_type.includes(props.priority))
      throw new Error("priority should be precise (high, average, low)");
    if (props && regex.test(props.dueDate) == false && props.dueDate != "")
      throw new Error("date should be in dd/mm/yyyy format");
    if (props && props.status == undefined) this.#status = statusDefault;
    if (props && props.status != undefined) {
      if (!status_type.includes(props.status))
        throw new Error("status should be precise");
    }
    let partsOfDate = props.dueDate.split("/");
    let partOfDateNumber = partsOfDate.map(Number);
    if (partOfDateNumber[2] == year) {
      if (partOfDateNumber[1] < month)
        throw new Error("the month must not be less than the current month");
    }
    if(partOfDateNumber[2] == year && partOfDateNumber[1] == month){
      if(partOfDateNumber[0] < day)
        throw new Error("the day must not be less than the current day");
    }
    if (partOfDateNumber[2] < year)
      throw new Error("the year must not be less than the current year");
    if (partOfDateNumber[1] <= 0 || partOfDateNumber[1] > 12)
      throw new Error("the month should be between 0 and 12");
    if (
      partOfDateNumber[2] % 4 == 0 ||
      (partOfDateNumber[2] % 100 == 0 && partOfDateNumber[2] % 400 == 0)
    ) {
      if (partOfDateNumber[1] == 2)
        if (partOfDateNumber[0] <= 0 || partOfDateNumber[0] > 29)
          throw new Error("the day should'nt execeed 29");
      if (partOfDateNumber[0] <= 0 || partOfDateNumber[0] > 31)
        throw new Error("the day should'nt execeed 31");
    }
    if (partOfDateNumber[1] == 2)
      if (partOfDateNumber[0] <= 0 || partOfDateNumber[0] > 28)
        throw new Error("the day should'nt execeed 28");
    if (props.dueDate != "")
      if (partOfDateNumber[0] <= 0 || partOfDateNumber[0] > 31)
        throw new Error("the day should'nt execeed 31");

    this.id = Task.#id++;
    this.#name = props.name;
    this.#priority = props.priority;
    this.#dueDate = props.dueDate;
    if (props.dueDate == "") this.#dueDate = completeDate;
    this.#status = "todo";
  }

  /**
   * getters
   */
  get name() {
    return this.#name;
  }

  get priority() {
    return this.#priority;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get status() {
    return this.#status;
  }

  getId() {
    return this.id;
  }

  /**
   * setters
   */
  set status(value) {
    if (!status_type.includes(value))
      throw new Error("status should be precise");
    const result = this.isMoveCurrentSatutsToNextStatus(this.#status, value);
    if (result == false)
      throw new Error("you don't pass this status to status specified");
    else this.#status = value;
  }

  set name(value) {
    if (typeof value != "string" || value == "")
      throw new Error("name attribute should be a non-empty string");
    this.#name = value;
  }

  set priority(value) {
    if (!priority_type.includes(value))
      throw new Error("priority should be precise (high, average, low)");
    this.#priority = value;
  }

  set dueDate(value) {
    if (regex.test(value) == false && value != "")
      throw new Error("date should be in dd/mm/yyyy format");
    let date = new Date(value);
    let dateDefault = new Date(completeDate);
    if (date < dateDefault)
      throw new Error("the due date of task should'nt exceeds the date of day");
    if (value != completeDate) this.#dueDate = value;
    if (value == "") this.#dueDate = completeDate;
  }

  /**
   * Méthod isMoveCurrentSatutsToNextStatus
   */
  isMoveCurrentSatutsToNextStatus(currentStatus, nextStatus) {
    if (
      currentStatus == "in_progress" &&
      (nextStatus == "waiting" ||
        nextStatus == "done" ||
        nextStatus == "canceled")
    )
      return true;
    if (
      currentStatus == "waiting" &&
      (nextStatus == "in_progress" ||
        nextStatus == "done" ||
        nextStatus == "canceled")
    )
      return true;
    if (
      currentStatus == "todo" &&
      (nextStatus == "in_progress" || nextStatus == "canceled")
    )
      return true;
    if (currentStatus == "canceled" && nextStatus == "todo") return true;
    return false;
  }
}