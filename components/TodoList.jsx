// import {useContext} from "react";
// import {TodoContext} from "../../store/context.js";
// import {Link} from "react-router";
//
// export default function TodoList() {
//
//     const todoStore = useContext(TodoContext);
//
//     const {dispath, state} = todoStore;
//
//     console.log(state);
//
//     return (
//         <div> TodoList
//             <Link to="/">Home</Link>
//             <input type ="text"
//                    value={state.todoInput} // bind the input field to state.todoInput,
//                                            // so when it’s cleared, the UI updates:
//                    onChange={(e) => dispath({
//                 type: "ON_CHANGE", // a string describe type to perform cases
//                 payload: e.target.value, // data pass along with the action
//                 })
//                 }
//                 />
//             <button
//             onClick={() => dispath({
//                 type: "ADD",
//             })}>
//                 add </button>
//
//             <div><Link to="/app">App</Link></div>
//             <div>
//                 <ul>
//
//                     {state.todos.map((todo, index) => {
//                     return <li key={index} style={{display: 'flex', alignItems: 'center', marginBottom: 8}} > {todo}
//                     <button onClick={() => dispath({
//                         type: "DELETE",
//                         payload: index, // this define for reducer to know what action.payload is
//                     })}> Delete </button>
//                     </li>
//                     })}
//
//                 </ul>
//             </div>
//
//
//         </div>
// )
// }