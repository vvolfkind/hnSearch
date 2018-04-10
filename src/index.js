import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//testeo CONST en lugar de LET. No se puede cambiar, pero armando un array y con 
//dot notation puedo crear nuevos valores en "para" mas adelante
//en la parte de render
/*const para = {
    text: "When you have a talking mouth, you dont have listening ears!"
};

class Hello extends React.Component {
    render(){

        para.newPara = "I can change you!";

        return(
            //JSX adyacentes van en un solo div
            <div>
                <h1> {para.text} </h1>
                <p> {para.newPara} </p>
            </div>
            //h1 retorna el texto (value) y p retorna el newPara
        )
    }
}
*/

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
