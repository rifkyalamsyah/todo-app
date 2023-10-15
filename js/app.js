document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  const todos = [];
  const RENDER_EVENT = 'render-todo';

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  //   Add todo
  function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(
      generatedID,
      textTodo,
      timestamp,
      false
    );
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function generateId() {
    return +new Date();
  }

  //   Generate todo object
  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    // console.log(todos);

    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
      else completedTODOList.append(todoElement);
    }
  });

  //   Make todo
  function makeTodo(todoObject) {
    // create element
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    // uncheck & delete
    if (todoObject.isCompleted) {
      // undo button
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');

      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(todoObject.id);
      });

      // delete button
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');

      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');

      checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    // add task to completed
    function addTaskToCompleted(todoId) {
      const todoTarget = findTodo(todoId);

      if (todoTarget == null) return;

      todoTarget.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // find todo list
    function findTodo(todoId) {
      for (const todoItem of todos) {
        if (todoItem.id === todoId) {
          return todoItem;
        }
      }
      return null;
    }

    // remove task
    function removeTaskFromCompleted(todoId) {
      const todoTarget = findTodoIndex(todoId);

      if (todoTarget === -1) return;

      todos.splice(todoTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    //   undo task from completed
    function undoTaskFromCompleted(todoId) {
      const todoTarget = findTodo(todoId);

      if (todoTarget == null) return;

      todoTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // find todo index
    function findTodoIndex(todoId) {
      for (const index in todos) {
        if (todos[index].id === todoId) {
          return index;
        }
      }

      return -1;
    }

    return container;
  }
});
