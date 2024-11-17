const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const formData = new FormData(e.target); 
    const name = formData.get('name');
    const age = formData.get('age');
    const emotion = formData.get('emotion');

    console.log('Form Data:', { name, age, emotion });
    if (!name || !age || !emotion) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, emotion }, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="emotion">Emotion: </label>
            <select id="domoEmotion" name="emotion">
                <option value="neutral">Neutral</option>
                <option value="sad">Sad</option>
                <option value="blush">Blush</option>
                <option value="angry">Angry</option>
            </select>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    const deleteDomo = async (id) => {
        try {
            const response = await fetch(`/deleteDomo/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setDomos(domos.filter(domo => domo._id !== id));
            } else {
                console.error('Failed to delete Domo');
            }
        } catch (error) {
            console.error('Error deleting Domo:', error);
        }
    };

    if(domos.length === 0){
        return (
            <div className = "domoList">
                <h3 className="emptyDomo">No Domos yet!</h3>
            </div>
        );
    }
    const emotionImages = {
        neutral: '/assets/img/domoface.jpeg',
        sad: '/assets/img/domofacesad.jpeg',
        blush: '/assets/img/domofaceblush.jpeg',
        angry: '/assets/img/domofaceangry.jpeg',
    };
    
    const domoNodes = domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src={emotionImages[domo.emotion]} alt={domo.emotion} className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoEmotion">Feeling {domo.emotion}!</h3>
                <button onClick={() => deleteDomo(domo._id)}>Delete</button>
            </div>
        );
    });

    return (
        <div className = "domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={()=> setReloadDomos(!reloadDomos)}/>
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos}/>
            </div>
        </div>
    );
};
const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />)
};
window.onload = init;