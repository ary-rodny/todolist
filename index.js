
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const deleteListBtn = document.querySelector('[data-delete-list]')
const todoDisplayContainer = document.querySelector('.todo')
const todo_title = document.querySelector('.todo__title')
const taskCount = document.querySelector('.tasks-count')
const tasksContainer = document.querySelector('[data-tasks-container]')
const taskTemplate = document.querySelector('#task-template')
const clearCompleteTaskBtn = document.querySelector('[data-clear-complete-task]')

const LS_listKey = 'task.lists'
const LS_selectedListIdKey = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LS_listKey)) || []
let selectedListId = JSON.parse(localStorage.getItem(LS_selectedListIdKey))


listsContainer.addEventListener('click', e => {
    if(e.target.classList.contains('tasks__list-name')){
        // e.target.getAttribute('data-list-id')
        selectedListId = e.target.dataset.listId
        saveAndRenderLists()
    }
})

tasksContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === "input"){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.completed = !selectedTask.completed
        saveLists()
        renderTaskCount(selectedList)
    }
})


//add a new list item
newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listname = newListInput.value
    if(listname == "" || listname === null ) return 
    const list = {id: Date.now().toString(), name:listname, tasks:[]}

    clearInput(newListInput)
    lists.push(list)
    saveAndRenderLists()
})


//add new task item
newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskname = newTaskInput.value
    if(taskname == "" || taskname === null ) return 
    const task = {id: Date.now().toString(), text:taskname, completed: false}

    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)

    clearInput(newTaskInput)
    saveAndRenderLists()
})


// delete the selected list
deleteListBtn.addEventListener('click', e => {
       lists = lists.filter(list => list.id !== selectedListId)
        selectedListId = null
        saveAndRenderLists()
})

clearCompleteTaskBtn.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.completed)
    saveAndRenderLists()
})

// save lists to the local storage
function saveLists(){
    localStorage.setItem(LS_listKey, JSON.stringify(lists))
    localStorage.setItem(LS_selectedListIdKey,JSON.stringify(selectedListId))
}

// saves the lists and render them
function saveAndRenderLists(){
    saveLists()
    render()
}

 
//render everything
function render()
{
    
    clearElement(listsContainer)
    renderLists()
    
    const selectedList = lists.find(list => list.id === selectedListId)
    
    if(selectedListId == null){
        todoDisplayContainer.style.display = "none"
    }
    else{
        todoDisplayContainer.style.display = ""
        todo_title.innerHTML = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

// render lists
function renderLists()
{
    lists.forEach(list => {
        let listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('tasks__list-name');
        if(list.id === selectedListId) listElement.classList.add('tasks__list--active')
        listElement.innerText = list.name
        listsContainer.appendChild(listElement)
    })
}

function renderTasks(selectedList){
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.completed
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.text)
        tasksContainer.appendChild(taskElement)
    })
}


function renderTaskCount(selectedTask){
    // const count = task.tasks.length;
    // taskCount.innerHTML = count + " task remaining"
    const imcompleteTasksCount = selectedTask.tasks.filter(task => task.completed === false).length
    const taskstring = (imcompleteTasksCount == 1) ? 'task' : 'tasks'
    taskCount.innerHTML = `${imcompleteTasksCount} ${taskstring} remaining`
}


/** clear element */
function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}


/** clear inputs */
function clearInput(input){
    input.value = ""
}

render()