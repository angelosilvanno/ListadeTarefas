const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class Element {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.listeners = {};
        this.style = {};
        this.parentElement = null;
        this.value = '';
        this.checked = false;
        this.textContent = '';
    }

    setAttribute(name, value) {
        this[name] = value;
    }

    appendChild(child) {
        child.parentElement = this;
        this.children.push(child);
    }

    removeChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
        child.parentElement = null;
    }

    querySelector(selector) {
        return this.children.find((child) => child.tagName === selector) || null;
    }

    addEventListener(type, listener) {
        this.listeners[type] = listener;
    }

    dispatch(type) {
        this.listeners[type]({ target: this, preventDefault() {} });
    }
}

const form = new Element('form');
const taskTitleInput = new Element('input');
const todoList = new Element('ul');
const nodes = {
    '#todo-form': form,
    '#task-title-input': taskTitleInput,
    '#todo-list': todoList,
};
const localStorage = {
    value: '[]',
    getItem() { return this.value; },
    setItem(_key, value) { this.value = value; },
};

vm.runInNewContext(
    fs.readFileSync(process.env.TASK_SOURCE || path.join(__dirname, '..', 'js', 'index.js'), 'utf8'),
    {
        document: { querySelector: (selector) => nodes[selector], createElement: (tagName) => new Element(tagName) },
        localStorage,
        window: {},
        alert: () => {},
    },
);

function addTask(title) {
    taskTitleInput.value = title;
    form.dispatch('submit');
}

addTask('Estudar');
addTask('Estudar');
assert.equal(todoList.children.length, 2);

todoList.children[0].children[2].dispatch('click');
assert.equal(todoList.children.length, 1);
assert.deepEqual(JSON.parse(localStorage.value), [{ title: 'Estudar', done: false }]);

const remainingTask = todoList.children[0];
const checkbox = remainingTask.children[0];
checkbox.checked = true;
checkbox.dispatch('change');
assert.equal(remainingTask.children[1].style.textDecoration, 'line-through');
assert.deepEqual(JSON.parse(localStorage.value), [{ title: 'Estudar', done: true }]);

remainingTask.children[2].dispatch('click');
assert.equal(todoList.children.length, 0);
assert.deepEqual(JSON.parse(localStorage.value), []);

console.log('PASS: duplicate task actions keep object identity and strikethrough');
