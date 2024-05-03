import React, { useState, useEffect } from "react";

export const TodoListForm = () => {

    const [task, setTask] = useState("");
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);

    const host = 'https://playground.4geeks.com/todo'

    const createUsers = async () => {
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
    }

    useEffect(() => {
        createUsers();
    }, []);

    const createTodo = async (setTask) => {
        const uri = host + '/todos/matias_kamelman';
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (task.trim() !== "") {
            setTask("");
            createTodo(task);
        } else {
            setTask("");
           
        }
    }

    const handleDelete = async (item) => {
        const itemId = item.id; 
        await deletePost(itemId);
        setList(list.filter((element) => element !== item))
    }

    return (
        <div className="container">
            <h1>My Todo List</h1>
            <form onSubmit={handleSubmit} aria-placeholder="Enter Task">
                <input type="text" id="disabledTextInput" className="form-control" placeholder="Enter Task"
                    value={task} onChange={(event) => setTask(event.target.value)} />
            </form>
            <ul className="list-group">
                {list.map((item, id) =>
                    <li key={id} className="list-group-item bg-light d-flex justify-content-between hidden-icon">
                        {item.label}
                        <span onClick={() => handleDelete(item)}>
                            <i className="fas fa-trash-alt text-danger" /><i />
                        </span>
                    </li>
                )}
                <li className="list-group-item text-end bg-light fw-lighter">
                    {list.length} items
                </li>
            </ul>
        </div>
    )
}
