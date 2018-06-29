import React from "react";
import "./App.css";

const colors = ["magenta", "cyan", "yellow", "blue", "red", "white", "green"];

const SOCKET_SERVER_URL = "ws://localhost:8080/";

const Block = ({ color, onMouseMove, onClick }) => (
    <div
        className="block"
        onMouseMove={onMouseMove}
        onClick={onClick}
        style={{ backgroundColor: colors[color] }}
    />
);

const Grid = ({
    grid,
    onMouseOverBlock,
    onClickBlock,
    onMouseUp,
    onMouseDown
}) => {
    return (
        <div className="grid" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            {grid.map((row, i) => (
                <div className="row" key={i}>
                    {row.map((blockColor, j) => (
                        <Block
                            color={blockColor}
                            key={j}
                            onMouseMove={onMouseOverBlock(i, j)}
                            onClick={onClickBlock(i, j)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

class LiveGrid extends React.Component {
    constructor(props) {
        super();

        this.socket = new WebSocket(SOCKET_SERVER_URL);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = message => this.onMessage(message);
        this.socket.onclose = this.onClose;

        this.state = { grid: null };
    }
    onOpen = () => {
        this.socket.send("step");
    };
    onClose = () => {
        console.log("socket closed");
    };
    onMessage = message => {
        console.log("Got a message");
        const data = JSON.parse(message.data);
        if (data && data.grid) {
            this.setState({ grid: data.grid });
        }
        setTimeout(this.askForNextState, 50);
    };
    askForNextState = () => {
        this.socket.send("step");
    };
    render = () => {
        const { grid } = this.state;
        return grid ? <Grid grid={grid} /> : null;
    };
}

class DrawingGrid extends React.Component {
    constructor(props) {
        super(props);
        const table = [
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 3, 3, 3, 3, 3]
        ];

        this.state = {
            grid: table,
            user: { isPainting: false, activeColor: 4 }
        };
    }
    changeColor = (i, j, newColor) => {
        this.setState(state => ({
            grid: this.insertItem(i, j, newColor, state.grid)
        }));
    };
    insertItem = (i, j, item, rows) => {
        return [
            ...rows.slice(0, i),
            [...rows[i].slice(0, j), item, ...rows[i].slice(j + 1)],
            ...rows.slice(i + 1)
        ];
    };
    onMouseOverBlock = (i, j) => {
        if (this.state.user.isPainting === true) {
            this.changeColor(i, j, this.state.user.activeColor);
        }
    };
    onClickBlock = (i, j) => {
        this.changeColor(i, j, this.state.user.activeColor);
    };
    onMouseDown = () => {
        this.setState(state => ({
            user: { ...state.user, isPainting: true }
        }));
    };
    onMouseUp = () => {
        if (this.state.user.isPainting === true) {
            this.setState(state => ({
                user: { ...state.user, isPainting: false }
            }));
        }
    };
    chooseColor = color => {
        console.log(color);
        this.setState(state => ({
            user: { ...state.user, activeColor: color }
        }));
    };
    render = () => {
        return (
            <Grid
                grid={this.state.grid}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseOverBlock={(i, j) => () => this.onMouseOverBlock(i, j)}
                onClickBlock={(i, j) => () => this.onClickBlock(i, j)}
            />
        );
    };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { live: false };
    }
    render() {
        return this.state.live ? <LiveGrid /> : <DrawingGrid />;
    }
}

export default App;
