import React, { useState, useEffect } from "react";
import { Spinner } from './Spinner.jsx'

export const TodoListForm = () => {

    const [task, setTask] = useState("");
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);
    const [edit, setEdit] = useState(false);
    const [currentTodo, setCurrentTodo] = useState({});

    const host = 'https://playground.4geeks.com/todo'
    const user = 'spain-65';
    const background = 'background';
    const backgroundSith = 'backgroundSith';

    const changeBodyClass = () => {
        const body = document.querySelector('body');
        if (list.length < 6) {
          body.classList.remove('backgroundSith');
          body.classList.add('background');
        } else {
          body.classList.remove('background');
          body.classList.add('backgroundSith');
        }
      };

    /*    const createUsers = async () => {
           const uri = host + '/users/matias_kamelman';
           const options = {
               method: 'POST'
           };
           const response = await fetch(uri, options)
           if (!response.ok) {
               console.log('Error creating user: ', response.ok, response.status, response.statusText);
               return;
           }
           const data = await response.json();
           console.log('User created: ', data);
           setUsers(data);
       } */
    const getTodos = async () => {
        const uri = `${host}/users/${user}`;
        const options = {
        };
        const response = await fetch(uri, options)
        console.log(response);
        if (!response.ok) {

            console.log('Error: ', response.status, response.statusText);
            return;
        }
        const data = await response.json()
        setList(data.todos)
        console.log('data: ', data);
    }

    useEffect(() => {
        getTodos();
        changeBodyClass();
    }, []);

    const createTodo = async (setTask) => {
        const uri = `${host}/todos/${user}`;
        const options = {
            method: 'POST',
            body: JSON.stringify({ label: setTask, is_done: false }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(uri, options)
        if (!response.ok) {
            console.log('Error creating todo: ', response.ok, response.status, response.statusText);
            return null;
        }
        const data = await response.json();
        console.log('Todo created: ', data);
        setList([...list, data]);
        return data.id;
    }

    const deletePost = async (itemId) => {
        const uri = host + '/todos/' + itemId;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error deleting todo: ', response.ok, response.status, response.statusText);
            return;
        }
        console.log('Todo deleted successfully:', response.ok), response.status, response.statusText;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (task.trim() !== "") {
            const todoID = await createTodo(task);
            if (todoID) {
                setTask("");
            }
        } else {
            setTask("");

        }
    }

    const handleDelete = async (item) => {
        const itemId = item.id;
        await deletePost(itemId);
        setList(list.filter((element) => element !== item))
    }

    const handleEditTodo = async (event) => {
        event.preventDefault();
        const dataToSend = {
            label: currentTodo.label,
            is_done: currentTodo.is_done
        }
        const uri = `${host}/todos/${currentTodo.id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dataToSend)

        }
        const response = await fetch(uri, options)
        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText);
            return
        }
        const data = await response.json();
        console.log('respuesta del PUT: ', data);
        getTodos()
        // setCurrentTodo({})
        setEdit(false)

    }

    const editTask = (item) => {
        setCurrentTodo(item);
        setEdit(true)
        console.log(item);
    }
    const resetEdit = () => {
        setCurrentTodo({})
        setEdit(false)
    }

    return (
        <div className={`container font ${list.length < 6 ? background : backgroundSith}`}>
            <h1>The Force Todo List</h1>
            {!list ?
                <div className="container">
                    <p>No existe usuario</p>
                    {/* Aquí podemos hacer un formulario para crear un usuario */}
                    <Spinner />
                </div>
                :
                <div className="container">
                    {edit ?
                        <form onSubmit={handleEditTodo}>
                            <label htmlFor="exampleInputEmail1" className="form-label text-success">Edit Task</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                value={currentTodo.label}
                                onChange={(event) => setCurrentTodo({ ...currentTodo, label: event.target.value })}/>

                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                    checked={currentTodo.is_done}
                                    onChange={(event) => setCurrentTodo({ ...currentTodo, is_done: event.target.checked })}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Completed</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="reset" onClick={resetEdit} className="btn btn-secondary ms-2">Cancel</button>
                        </form>
                        :
                        <form onSubmit={handleSubmit} aria-placeholder="Enter Task">
                            <input type="text" id="disabledTextInput" className="form-control" placeholder="Enter Task"
                                value={task} onChange={(event) => setTask(event.target.value)} />
                        </form>
                    }
                    <ul className="list-group">
                        {list.map((item, id) =>
                            <li key={id} className="list-group-item list-group-item-primary d-flex justify-content-between align-items-center hidden-icon">
                                <div>
                                    {item.is_done ? <i className="text-success me-2 fab fa-jedi-order"></i> : <i className="text-danger me-2 fab fa-galactic-republic"></i>}
                                    {item.label}
                                </div>
                                <div>
                                    <span onClick={() => editTask(item)} className="me-2">
                                        <i className="fas fa-edit text-success"></i>
                                    </span>
                                    <span onClick={() => handleDelete(item)}>
                                        <i className="fas fa-trash-alt text-danger" /><i />
                                    </span>
                                </div>
                            </li>
                        )}
                        <li className="list-group-item list-group-item-primary text-end fw-lighter">
                            {list.length} Tasks
                        </li>
                    </ul>
                </div>

            }
        </div>
    )
}
